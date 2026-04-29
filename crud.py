import sqlite3
import hashlib
import secrets
from contextlib import contextmanager

DB_NAME = "database.db"


@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def create_table():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario           TEXT    NOT NULL UNIQUE,
                nome_completo     TEXT    NOT NULL,
                email             TEXT    NOT NULL UNIQUE,
                data_nascimento   TEXT    NOT NULL,
                genero            TEXT    NOT NULL,
                senha_hash        TEXT    NOT NULL,
                senha_salt        TEXT    NOT NULL
            )
        """)


def _hash_senha(senha: str, salt: str | None = None) -> tuple[str, str]:
    if salt is None:
        salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac("sha256", senha.encode(), salt.encode(), 260_000)
    return h.hex(), salt


# --- CREATE ---
def criar_usuario(usuario: str, nome_completo: str, email: str, data_nascimento: str, genero: str, senha: str) -> int:
    senha_hash, senha_salt = _hash_senha(senha)
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO usuarios (usuario, nome_completo, email, data_nascimento, genero, senha_hash, senha_salt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (usuario, nome_completo, email, data_nascimento, genero, senha_hash, senha_salt),
        )
        return cursor.lastrowid


# --- READ ---
def listar_usuarios() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, usuario, nome_completo, email, data_nascimento, genero FROM usuarios ORDER BY id"
        ).fetchall()
        return [dict(row) for row in rows]


def buscar_por_usuario(usuario: str) -> dict | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, usuario, nome_completo, email, data_nascimento, genero FROM usuarios WHERE usuario = ?",
            (usuario,),
        ).fetchone()
        return dict(row) if row else None


def buscar_usuario(usuario_id: int) -> dict | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, usuario, nome_completo, email, data_nascimento, genero FROM usuarios WHERE id = ?",
            (usuario_id,),
        ).fetchone()
        return dict(row) if row else None


def verificar_senha(usuario_id: int, senha: str) -> bool:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT senha_hash, senha_salt FROM usuarios WHERE id = ?", (usuario_id,)
        ).fetchone()
    if not row:
        return False
    h, _ = _hash_senha(senha, row["senha_salt"])
    return secrets.compare_digest(h, row["senha_hash"])


# --- UPDATE ---
def atualizar_usuario(usuario_id: int, usuario: str, nome_completo: str, email: str, data_nascimento: str, genero: str) -> bool:
    with get_connection() as conn:
        cursor = conn.execute(
            "UPDATE usuarios SET usuario = ?, nome_completo = ?, email = ?, data_nascimento = ?, genero = ? WHERE id = ?",
            (usuario, nome_completo, email, data_nascimento, genero, usuario_id),
        )
        return cursor.rowcount > 0


def atualizar_senha(usuario_id: int, senha_nova: str) -> bool:
    senha_hash, senha_salt = _hash_senha(senha_nova)
    with get_connection() as conn:
        cursor = conn.execute(
            "UPDATE usuarios SET senha_hash = ?, senha_salt = ? WHERE id = ?",
            (senha_hash, senha_salt, usuario_id),
        )
        return cursor.rowcount > 0


# --- DELETE ---
def deletar_usuario(usuario_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM usuarios WHERE id = ?", (usuario_id,)
        )
        return cursor.rowcount > 0


# --- CLI ---
def exibir_usuarios(usuarios: list[dict]):
    if not usuarios:
        print("Nenhum usuário encontrado.")
        return
    print(f"\n{'ID':<5} {'Usuário':<15} {'Nome Completo':<25} {'Email':<28} {'Nascimento':<12} {'Gênero'}")
    print("-" * 95)
    for u in usuarios:
        print(f"{u['id']:<5} {u['usuario']:<15} {u['nome_completo']:<25} {u['email']:<28} {u['data_nascimento']:<12} {u['genero']}")
    print()


def menu():
    create_table()
    opcoes = {
        "1": "Listar usuários",
        "2": "Buscar usuário por ID",
        "3": "Criar usuário",
        "4": "Atualizar usuário",
        "5": "Alterar senha",
        "6": "Verificar senha",
        "7": "Deletar usuário",
        "0": "Sair",
    }

    while True:
        print("\n=== CRUD de Usuários ===")
        for k, v in opcoes.items():
            print(f"  [{k}] {v}")

        escolha = input("\nEscolha uma opção: ").strip()

        if escolha == "1":
            exibir_usuarios(listar_usuarios())

        elif escolha == "2":
            uid = int(input("ID do usuário: "))
            u = buscar_usuario(uid)
            if u:
                exibir_usuarios([u])
            else:
                print("Usuário não encontrado.")

        elif escolha == "3":
            usuario = input("Usuário: ").strip()
            nome_completo = input("Nome completo: ").strip()
            email = input("Email: ").strip()
            data_nascimento = input("Data de nascimento (DD/MM/AAAA): ").strip()
            genero = input("Gênero (M/F/Outro): ").strip()
            import getpass
            senha = getpass.getpass("Senha: ")
            uid = criar_usuario(usuario, nome_completo, email, data_nascimento, genero, senha)
            print(f"Usuário criado com ID {uid}.")

        elif escolha == "4":
            uid = int(input("ID do usuário a atualizar: "))
            u = buscar_usuario(uid)
            if not u:
                print("Usuário não encontrado.")
                continue
            usuario = input(f"Usuário [{u['usuario']}]: ").strip() or u["usuario"]
            nome_completo = input(f"Nome completo [{u['nome_completo']}]: ").strip() or u["nome_completo"]
            email = input(f"Email [{u['email']}]: ").strip() or u["email"]
            data_nascimento = input(f"Data de nascimento [{u['data_nascimento']}]: ").strip() or u["data_nascimento"]
            genero = input(f"Gênero [{u['genero']}]: ").strip() or u["genero"]
            if atualizar_usuario(uid, usuario, nome_completo, email, data_nascimento, genero):
                print("Usuário atualizado.")
            else:
                print("Falha ao atualizar.")

        elif escolha == "5":
            import getpass
            uid = int(input("ID do usuário: "))
            senha_nova = getpass.getpass("Nova senha: ")
            if atualizar_senha(uid, senha_nova):
                print("Senha alterada.")
            else:
                print("Usuário não encontrado.")

        elif escolha == "6":
            import getpass
            uid = int(input("ID do usuário: "))
            senha = getpass.getpass("Senha: ")
            if verificar_senha(uid, senha):
                print("Senha correta.")
            else:
                print("Senha incorreta.")

        elif escolha == "7":
            uid = int(input("ID do usuário a deletar: "))
            if deletar_usuario(uid):
                print("Usuário deletado.")
            else:
                print("Usuário não encontrado.")

        elif escolha == "0":
            print("Saindo.")
            break

        else:
            print("Opção inválida.")


if __name__ == "__main__":
    menu()
