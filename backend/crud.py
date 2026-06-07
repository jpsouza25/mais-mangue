"""
CRUD de usuários (Create, Read, Update, Delete) usando SQLite.

CRUD são as 4 operações básicas de um banco de dados:
    C - Criar   (INSERT)
    R - Ler     (SELECT)
    U - Atualizar(UPDATE)
    D - Apagar  (DELETE)

Cada função abaixo abre a conexão, executa um comando SQL e fecha a conexão.
"""
import os
import sqlite3
import hashlib
import secrets

DB_NAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db")


def conectar():
    """Abre uma conexão com o banco de dados."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    """Cria a tabela 'usuarios' (só na primeira vez)."""
    conn = conectar()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario         TEXT NOT NULL UNIQUE,
            nome_completo   TEXT NOT NULL,
            email           TEXT NOT NULL UNIQUE,
            data_nascimento TEXT NOT NULL,
            genero          TEXT NOT NULL,
            senha_hash      TEXT NOT NULL,
            senha_salt      TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def _embaralhar_senha(senha, salt=None):
    """Transforma a senha em um código embaralhado (hash), para nunca guardar
    a senha em texto puro. (Detalhe avançado — pode pular na explicação.)"""
    if salt is None:
        salt = secrets.token_hex(16)
    codigo = hashlib.pbkdf2_hmac("sha256", senha.encode(), salt.encode(), 260_000)
    return codigo.hex(), salt


def criar_usuario(usuario, nome_completo, email, data_nascimento, genero, senha):
    """Insere um novo usuário e devolve o id criado."""
    senha_hash, senha_salt = _embaralhar_senha(senha)

    conn = conectar()
    cursor = conn.execute(
        """INSERT INTO usuarios
           (usuario, nome_completo, email, data_nascimento, genero, senha_hash, senha_salt)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (usuario, nome_completo, email, data_nascimento, genero, senha_hash, senha_salt),
    )
    conn.commit()
    conn.close()
    return cursor.lastrowid


def listar_usuarios():
    """Devolve a lista de todos os usuários."""
    conn = conectar()
    linhas = conn.execute(
        "SELECT id, usuario, nome_completo, email, data_nascimento, genero FROM usuarios ORDER BY id"
    ).fetchall()
    conn.close()
    return [dict(linha) for linha in linhas]


def buscar_usuario(usuario_id):
    """Procura um usuário pelo id."""
    conn = conectar()
    linha = conn.execute(
        "SELECT id, usuario, nome_completo, email, data_nascimento, genero FROM usuarios WHERE id = ?",
        (usuario_id,),
    ).fetchone()
    conn.close()
    return dict(linha) if linha else None


def buscar_por_login(identificador):
    """Procura um usuário pelo nome de usuário OU pelo e-mail."""
    conn = conectar()
    linha = conn.execute(
        """SELECT id, usuario, nome_completo, email, data_nascimento, genero
           FROM usuarios WHERE usuario = ? OR LOWER(email) = LOWER(?)""",
        (identificador, identificador),
    ).fetchone()
    conn.close()
    return dict(linha) if linha else None


def verificar_senha(usuario_id, senha):
    """Confere se a senha digitada bate com a do usuário."""
    conn = conectar()
    linha = conn.execute(
        "SELECT senha_hash, senha_salt FROM usuarios WHERE id = ?", (usuario_id,)
    ).fetchone()
    conn.close()

    if linha is None:
        return False
    codigo, _ = _embaralhar_senha(senha, linha["senha_salt"])
    return secrets.compare_digest(codigo, linha["senha_hash"])


def atualizar_usuario(usuario_id, usuario, nome_completo, email, data_nascimento, genero):
    """Atualiza os dados de um usuário. Devolve True se atualizou."""
    conn = conectar()
    cursor = conn.execute(
        """UPDATE usuarios
           SET usuario = ?, nome_completo = ?, email = ?, data_nascimento = ?, genero = ?
           WHERE id = ?""",
        (usuario, nome_completo, email, data_nascimento, genero, usuario_id),
    )
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def atualizar_senha(usuario_id, senha_nova):
    """Troca a senha de um usuário. Devolve True se atualizou."""
    senha_hash, senha_salt = _embaralhar_senha(senha_nova)

    conn = conectar()
    cursor = conn.execute(
        "UPDATE usuarios SET senha_hash = ?, senha_salt = ? WHERE id = ?",
        (senha_hash, senha_salt, usuario_id),
    )
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def deletar_usuario(usuario_id):
    """Apaga um usuário pelo id. Devolve True se apagou."""
    conn = conectar()
    cursor = conn.execute("DELETE FROM usuarios WHERE id = ?", (usuario_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def exibir_usuarios(usuarios):
    """Mostra os usuários em forma de tabela no terminal."""
    if not usuarios:
        print("Nenhum usuário encontrado.")
        return
    print("\nID  | Usuário        | Nome completo")
    print("-" * 50)
    for u in usuarios:
        print(f"{u['id']:<3} | {u['usuario']:<14} | {u['nome_completo']}")
    print()


def menu():
    create_table()
    while True:
        print("\n===== CRUD de Usuários =====")
        print("1 - Listar usuários")
        print("2 - Criar usuário")
        print("3 - Atualizar usuário")
        print("4 - Apagar usuário")
        print("0 - Sair")
        opcao = input("Escolha uma opção: ").strip()

        if opcao == "1":
            exibir_usuarios(listar_usuarios())

        elif opcao == "2":
            usuario = input("Usuário: ")
            nome = input("Nome completo: ")
            email = input("E-mail: ")
            nascimento = input("Data de nascimento: ")
            genero = input("Gênero: ")
            senha = input("Senha: ")
            novo_id = criar_usuario(usuario, nome, email, nascimento, genero, senha)
            print(f"Usuário criado com id {novo_id}.")

        elif opcao == "3":
            uid = int(input("ID do usuário: "))
            usuario = input("Novo usuário: ")
            nome = input("Novo nome completo: ")
            email = input("Novo e-mail: ")
            nascimento = input("Nova data de nascimento: ")
            genero = input("Novo gênero: ")
            if atualizar_usuario(uid, usuario, nome, email, nascimento, genero):
                print("Usuário atualizado.")
            else:
                print("Usuário não encontrado.")

        elif opcao == "4":
            uid = int(input("ID do usuário: "))
            if deletar_usuario(uid):
                print("Usuário apagado.")
            else:
                print("Usuário não encontrado.")

        elif opcao == "0":
            print("Saindo...")
            break

        else:
            print("Opção inválida.")


if __name__ == "__main__":
    menu()
