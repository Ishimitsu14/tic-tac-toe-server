import {checkSchema} from 'express-validator'
import {User} from "@models/User";

export const registerPostScheme = checkSchema({
    username: {
        isLength: {
            errorMessage: 'Username should be at least 4 chars long',
            options: { min: 4 }
        },
        custom: {
            errorMessage: 'Username already is used',
            options: async (value: string): Promise<any> => {
                const user = await User.findOne({ where: { username: value } })
                return user === null ? Promise.resolve() : Promise.reject()
            },
        }
    },
    email: {
        isEmail: {
            bail: true,
        },
        custom: {
            errorMessage: 'Email already is used',
            options: async (value: string): Promise<any> => {
                const user = await User.findOne({ where: { email: value } })
                return user === null ? Promise.resolve() : Promise.reject()
            },
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 },
        },
        custom: {
            errorMessage: 'Passwords do not match',
            options: (value, { req }) => {
                return value === req.body.passwordConfirmation
            }
        }
    },
    passwordConfirmation: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 },
        },
    }
})

export const recoveryPasswordSentLinkPostScheme = checkSchema({
    email: {
        isEmail: {
            bail: true
        },
    }
})

export const recoveryPasswordPostScheme = checkSchema({
    password: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 },
        },
        custom: {
            errorMessage: 'Passwords do not match',
            options: (value, { req }) => {
                return value === req.body.passwordConfirmation
            }
        }
    },
    passwordConfirmation: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 },
        },
    }

})