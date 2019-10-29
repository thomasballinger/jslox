import {keywords} from './keywords';
import {Token} from './token';
import {TokenType} from './tokenType';


class ParseError extends Error {
  constructor(token, ...args) {
    super(...args);
    this.token = token;
  }
  toString() {
    return `${this.message} at ${this.token}`;
  }
}

export const scanTokens = source => {
  // a bunch of stateful helpers here use this state
  let start = 0;
  let current = 0;
  let line = 1;
  let tokens = [];

  const isAtEnd = () => current >= source.length;
  const advance = () => {
    return source[current++];
  };
  const addToken = (type, literal = null) => {
    const text = source.substring(start, current);
    tokens.push(new Token(type, text, literal, line));
  };
  const match = expected => {
    if (isAtEnd()) return false;
    if (source[current] != expected) return false;
    current++;
    return true;
  };
  const peek = () => {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  };
  const peekNext = () => {
    if (current + 1 >= source.length) return '\0';
    return source.charAt(current + 1);
  };
  const string = () => {
    while (peek() != '"' && !isAtEnd()) {
      if (peek() == '\n') line++;
      advance();
    }

    // Unterminated string.
    if (isAtEnd()) {
      throw ParseError(source[source.length - 1], "Unterminated string.");
      return;
    }

    // The closing ".
    advance();

    // Trim the surrounding quotes.
    const value = source.substring(start + 1, current - 1);
    addToken(TokenType.STRING, value);
  };
  const isDigit = c => {
    return c >= '0' && c <= '9';
  };
  const number = () => {
    while (isDigit(peek())) {
      advance();
    }

    // Look for a fractional part.
    if (peek() == '.' && isDigit(peekNext())) {
      // Consume the "."
      advance();

      while (isDigit(peek())) advance();
    }

    addToken(TokenType.NUMBER, parseFloat(source.substring(start, current)));
  };
  const isAlpha = c => {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
  };
  const isAlphaNumeric = c => {
    return isAlpha(c) || isDigit(c);
  };
  const identifier = () => {
    while (isAlphaNumeric(peek())) advance();
    const text = source.substring(start, current);

    let type = keywords[text];
    if (type === undefined) {
      type = TokenType.IDENTIFIER;
    }
    addToken(type);
  };

  const scanToken = () => {
    const c = advance();
    switch (c) {
      case '(':
        addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        addToken(TokenType.COMMA);
        break;
      case '.':
        addToken(TokenType.DOT);
        break;
      case '-':
        addToken(TokenType.MINUS);
        break;
      case '+':
        addToken(TokenType.PLUS);
        break;
      case ';':
        addToken(TokenType.SEMICOLON);
        break;
      case '*':
        addToken(TokenType.STAR);
        break;
      case '!':
        addToken(match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        addToken(match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (match('/')) {
          // A comment goes until the end of the line.
          while (peek() != '\n' && !isAtEnd()) advance();
        } else {
          addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        line++;
        break;

      case '"':
        string();
        break;

      default:
        if (isDigit(c)) {
          number();
        } else if (isAlpha(c)) {
          identifier();
        } else {
          reportError(line, "Unexpected character.");
        }
        break;
    }
  };

  while (!isAtEnd()) {
    start = current;
    scanToken();
  }

  tokens.push(new Token(TokenType.EOF, '', '', line));

  return tokens;
}
