<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Vue Example</title>

    <!--+->
    <link rel="stylesheet" href="./css/bootstrap.css"> <!-- 4.6.2 -->
    <!---->
    <link rel="stylesheet" href="./css/main.css">
    <!---->
    <script src="./ext/vue.global.min.js"></script> <!-- 3.2.47 -->
    <script src="./ext/vue-router.global.min.js"></script> <!-- 4.1.6 -->
    <!--+->
    <script src="./ext/axios.min.js"></script>  <!-- 1.3.3 -->
    <!---->

  </head>
  <body>
    <div id="app"><Navbar /></div>
    
    <!---->
    <script src="./dist/com/weather.js"></script>
    <script src="./dist/bundle.js"></script>
    <!---->

    <!--+->
    <script type='module'>
      import './src/weather.js'
      import "./src/main.js"
    </script>
    <!---->
  </body>
</html>