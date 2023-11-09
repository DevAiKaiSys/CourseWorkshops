npx create-react-app my-app

install bootstrap with CDN

```
// public/index.html

  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  </body>
```

npm install axios
npm install sweetalert2
npm install react-router-dom

use Template AdminLTE v3.2.0
downgrade to Bootstrap 4

```
https://adminlte.io/
```

Tip convenrt html to js
find & replace with regex

```
<!--[\s\S\n]*?-->  replace  null
<input(?!.*\/>)((?:[\s\S\n]*?))>  replace  <input$1/>
<img(?!.*\/>)((?:[\s\S\n]*?))>  replace  <img$1/>
class=  replace  className=
```

npm install dayjs
