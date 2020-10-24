import {Sequelize, DataTypes, Model} from "sequelize";
import bcrypt from "bcrypt";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {dialect: "postgres", logging: false});
export const saltRounds = 10;

export class User extends Model {
    async setPassword(self, password: String) {
        self.password = await bcrypt.hash(password, saltRounds);
    }

    async checkPassword(self, password: String): Boolean {
        await bcrypt.compare(password, self.password);
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User'
});

export class SimpleHelp extends Model {
}

SimpleHelp.init({
    requestingUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fulfillingUser: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    latitude: {type: DataTypes.DECIMAL(11, 2), allowNull: false},
    longitude: {type: DataTypes.DECIMAL(11, 2), allowNull: false},
}, {
    sequelize,
    modelName: "SimpleHelp"
});

SimpleHelp.belongsTo(User, {
    foreignKey: "requestingUser"
});

SimpleHelp.belongsTo(User, {
    foreignKey: "fulfillingUser"
});

export class ComplexHelp extends Model {

}

ComplexHelp.init({
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "ComplexHelp"
});

ComplexHelp.belongsTo(User, {
    foreignKey: "requestingUserId"
});

ComplexHelp.belongsTo(User, {
    foreignKey: "fulfillingUserId"
});

export class ComplexHelpLocation extends Model {
}

ComplexHelpLocation.init({
    latitude: {type: DataTypes.DECIMAL(11, 2), allowNull: false},
    longitude: {type: DataTypes.DECIMAL(11, 2), allowNull: false},
    step: {
        type: DataTypes.INTEGER
    },
    complexHelp: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: "ComplexHelpLocation"
});

ComplexHelpLocation.belongsTo(ComplexHelp, {
    foreignKey: "complexHelpId"
})
