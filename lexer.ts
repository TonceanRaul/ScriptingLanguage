export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParan,
    CloseParan,
    BinaryOperator,
    Let,
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
}

export interface Token {
    value: string
    type: TokenType
}

function token(value: string, type: TokenType): Token {
    return { value, type }
}

function isAlpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase()
}

function isInt(src: string): boolean {
    const c = src.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]

    return c >= bounds[0] && c <= bounds[1]
}

function isSkippable(str: string): boolean {
    return str == ' ' || str == '\n' || str == '\t'
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>()
    const src = sourceCode.split('')

    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(token(src.shift()!, TokenType.OpenParan))
        } else if (src[0] == ')') {
            tokens.push(token(src.shift()!, TokenType.CloseParan))
        } else if (
            src[0] == '+' ||
            src[0] == '-' ||
            src[0] == '*' ||
            src[0] == '/'
        ) {
            tokens.push(token(src.shift()!, TokenType.BinaryOperator))
        } else if (src[0] == '=') {
            tokens.push(token(src.shift()!, TokenType.Equals))
        } else {
            if (isInt(src[0])) {
                let num = ''
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift()
                }
                tokens.push(token(num, TokenType.Number))
            } else if (isAlpha(src[0])) {
                let identifier = ''
                while (src.length > 0 && isAlpha(src[0])) {
                    identifier += src.shift()
                }

                const reserved = KEYWORDS[identifier]

                if (reserved == undefined) {
                    tokens.push(token(identifier, TokenType.Identifier))
                } else {
                    tokens.push(token(identifier, reserved))
                }
            } else if (isSkippable(src[0])) {
                src.shift()
            } else {
                console.log('Unrecognised character ', src[0])
            }
        }
    }
    return tokens
}
