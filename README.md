<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <h1>Proyecto 3 - Base de Datos</h1>
  
  <h2>Descripción</h2>
  <p>Este es el tercer proyecto del curso que implementa una base de datos con interfaz frontend.</p>
  
  <h2>Requisitos</h2>
  <ul>
    <li>Docker instalado</li>
    <li>Git instalado</li>
  </ul>
  
  <h2>Instalación y Configuración</h2>
  <ol>
    <li>Clonar el repositorio:
      <pre><code>git clone https://github.com/diegoanro22/Proyect-3-DB.git</code></pre>
    </li>
    <li>Navegar al directorio del proyecto:
      <pre><code>cd Proyect-3-DB</code></pre>
    </li>
    <li>Configurar variables de entorno:
      <ul>
        <li>Copiar el archivo .env.example:
          <pre><code>cp .env.example .env</code></pre>
        </li>
        <li>Editar el archivo .env y agregar las credenciales de conexión a la base de datos</li>
      </ul>
    </li>
    <li>Levantar los contenedores de Docker:
      <pre><code>docker-compose up --build</code></pre>
    </li>
  </ol>

  <h3>Atención</h3>
  <p>
    Si al levantar los contenedores de Docker ocurre un error relacionado con <code>wait-for-db.sh</code>, es posible que se deba al formato de fin de línea (CRLF). 
    Para solucionarlo:
  </p>
  <ul>
    <li>Abre el archivo <code>wait-for-db.sh</code> en Visual Studio Code</li>
    <li>Cambia el formato de fin de línea de <strong>CRLF</strong> a <strong>LF</strong> (en la esquina inferior derecha)</li>
    <li>Guarda el archivo</li>
    <li>Vuelve a levantar los contenedores con:
      <pre><code>docker-compose up --build</code></pre>
    </li>
  </ul>
  
  <h2>Uso</h2>
  <p>Una vez que los contenedores estén en ejecución:</p>
  <ul>
    <li>El frontend estará disponible en <a href="http://localhost:8000">http://localhost:8000</a></li>
  </ul>
</body>
</html>