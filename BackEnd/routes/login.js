import express from "express";
import con from "../config.js"; 

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: O nome de usuário para login
 *         password:
 *           type: string
 *           description: A senha associada ao nome de usuário
 *       required:
 *         - username
 *         - password
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Realiza login de um usuário.
 *     description: Este endpoint autentica um usuário com nome de usuário e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         description: Campos obrigatórios ausentes.
 *       401:
 *         description: Usuário ou senha inválidos.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const [user] = await con.promise().query(query, [username]);

    if (user.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const storedHash = user[0].password_salt;

    const isPasswordValid = password === storedHash

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;







