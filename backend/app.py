"""API REST do +Mangue (Flask + SQLite).

Serve apenas JSON em /api/* — a interface é o app React (frontend/), que acessa
estas rotas através do proxy do Vite. A autenticação usa sessão por cookie.
"""
import os
from flask import Flask, request, jsonify, session

import crud

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-mais-mangue-troque-em-producao")

crud.create_table()


@app.route("/")
def index():
    return jsonify({"app": "+Mangue API", "status": "ok"})


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json or {}
    try:
        uid = crud.criar_usuario(
            data["usuario"], data["nome_completo"], data["email"],
            data["data_nascimento"], data["genero"], data["senha"],
        )
        session["user_id"] = uid
        session["usuario"] = data["usuario"]
        return jsonify({"success": True})
    except Exception as e:
        msg = "Usuário ou e-mail já cadastrado" if "UNIQUE" in str(e) else str(e)
        return jsonify({"success": False, "message": msg})


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json or {}
    identificador = (data.get("usuario", "") or "").strip()
    user = crud.buscar_por_login(identificador)
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado"})
    if not crud.verificar_senha(user["id"], data.get("senha", "")):
        return jsonify({"success": False, "message": "Senha incorreta"})
    session["user_id"] = user["id"]
    session["usuario"] = user["usuario"]
    return jsonify({"success": True})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/me")
def api_me():
    if "user_id" not in session:
        return jsonify({"authenticated": False}), 401
    user = crud.buscar_usuario(session["user_id"])
    if not user:
        session.clear()
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "user": user})


def _require_login():
    return "user_id" in session


@app.route("/api/users", methods=["GET"])
def api_users():
    if not _require_login():
        return jsonify({"error": "Não autorizado"}), 401
    return jsonify(crud.listar_usuarios())


@app.route("/api/users/<int:uid>", methods=["PUT"])
def api_update_user(uid):
    if not _require_login():
        return jsonify({"error": "Não autorizado"}), 401
    data = request.json or {}
    try:
        ok = crud.atualizar_usuario(
            uid, data["usuario"], data["nome_completo"],
            data["email"], data["data_nascimento"], data["genero"],
        )
        return jsonify({"success": ok})
    except Exception as e:
        msg = "Usuário ou e-mail já cadastrado" if "UNIQUE" in str(e) else str(e)
        return jsonify({"success": False, "message": msg})


@app.route("/api/users/<int:uid>", methods=["DELETE"])
def api_delete_user(uid):
    if not _require_login():
        return jsonify({"error": "Não autorizado"}), 401
    return jsonify({"success": crud.deletar_usuario(uid)})


@app.route("/api/users/<int:uid>/password", methods=["PUT"])
def api_update_password(uid):
    if not _require_login():
        return jsonify({"error": "Não autorizado"}), 401
    data = request.json or {}
    return jsonify({"success": crud.atualizar_senha(uid, data["senha"])})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
