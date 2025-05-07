# Usa una imagen base de Python
FROM python:3.12

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . /app

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Instala netcat-openbsd para poder esperar la conexión de la base de datos
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copia el script wait-for-db.sh
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expone el puerto en el que la app correrá
EXPOSE 8000

# Ejecuta la app (suponiendo que es una app de Django)
CMD ["/wait-for-db.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]