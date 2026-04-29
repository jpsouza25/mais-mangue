import secrets
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import crud

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

crud.create_table()


@app.route("/")
def index():
    return redirect(url_for("admin") if "user_id" in session else url_for("login_page"))


@app.route("/login")
def login_page():
    if "user_id" in session:
        return redirect(url_for("admin"))
    return render_template("login.html")


@app.route("/admin")
def admin():
    if "user_id" not in session:
        return redirect(url_for("login_page"))
    return render_template("admin.html", usuario=session.get("usuario"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login_page"))


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    user = crud.buscar_por_usuario(data.get("usuario", ""))
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado"})
    if not crud.verificar_senha(user["id"], data.get("senha", "")):
        return jsonify({"success": False, "message": "Senha incorreta"})
    session["user_id"] = user["id"]
    session["usuario"] = user["usuario"]
    return jsonify({"success": True})


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json
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


@app.route("/api/users", methods=["GET"])
def api_users():
    if "user_id" not in session:
        return jsonify({"error": "Não autorizado"}), 401
    return jsonify(crud.listar_usuarios())


@app.route("/api/users/<int:uid>", methods=["PUT"])
def api_update_user(uid):
    if "user_id" not in session:
        return jsonify({"error": "Não autorizado"}), 401
    data = request.json
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
    if "user_id" not in session:
        return jsonify({"error": "Não autorizado"}), 401
    return jsonify({"success": crud.deletar_usuario(uid)})


@app.route("/api/users/<int:uid>/password", methods=["PUT"])
def api_update_password(uid):
    if "user_id" not in session:
        return jsonify({"error": "Não autorizado"}), 401
    data = request.json
    return jsonify({"success": crud.atualizar_senha(uid, data["senha"])})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
