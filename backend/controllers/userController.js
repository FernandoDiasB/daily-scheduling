const userModel = require('../models/userModel');


exports.getAllUsers = async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'Usuário não encontrado!'
            })
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'Usuário não encontradoooo!'
            })
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).json({
                status:'fail',
                message: 'Usuário não encontrado!'
            })
        }

        res.status(200).json({
            status:'succes',
            message: 'Usuário excluído!'
        })
    } catch (error) {
        res.status(500).json({
            status:'fail',
            message: error.message
        })
    }
}