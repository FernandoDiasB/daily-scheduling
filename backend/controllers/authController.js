const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: "Usuário criado com sucesso",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const correct = await user.correctPassword(password, user.password);
        if (!correct) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        res.status(200).json({
            message: "Login bem-sucedido",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error });
    }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Você não está logado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    req.user = currentUser; // ✅ agora req.user.id estará disponível
    next();
  } catch (error) {
    console.error("Erro no middleware protect:", error);
    res.status(401).json({ message: "Token inválido", error: error.message });
  }
};
