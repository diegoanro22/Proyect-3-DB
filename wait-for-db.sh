#!/bin/sh

# Espera a que la base de datos esté disponible
echo "Esperando a que PostgreSQL esté listo..."

while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL está listo"

echo "Iniciando servidor Django..."
exec "$@"
