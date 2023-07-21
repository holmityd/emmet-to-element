# EmmetToElement

EmmetToElement is a JavaScript library that provides functions for converting Emmet-like syntax into HTML elements.

## Functions

### emmetToElements

```javascript
emmetToElements('section#page>(header>h1{Header} + #content{Content})')
```

This function takes a string parameter, emmetString, which represents a simplified Emmet-like script. It converts this script into an array of HTML elements.

### simplifiedEmmetToElement

```javascript
simplifiedEmmetToElement('button#submit{Submit}')
```

This function converts a simplified Emmet-like script into an HTMLElement. The simplified Emmet script does not support '>', '+', and '()' operations.

## License
This project is licensed under the MIT License.