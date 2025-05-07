-- ddl.sql

-- planes_membresia
create table planes_membresia (
    id_plan serial primary key,
    nombre_plan varchar(50) not null,
    descripcion text,
    precio_mensual numeric(10,2) check (precio_mensual >= 0),
    acceso_24h boolean default false,
    incluye_clases_grupales boolean default false,
    constraint uk_plan_nombre unique (nombre_plan)
);

-- socios
create table socios (
    id_socio serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    fecha_nacimiento date check (fecha_nacimiento <= current_date),
    telefono varchar(20) check (telefono ~ '^[0-9]+$'),
    email varchar(100) not null unique check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    id_plan integer references planes_membresia(id_plan),
    fecha_inscripcion timestamp default current_timestamp,
    activo boolean default true,
    notas text,
    constraint chk_telefono_length check (length(telefono) between 8 and 20)
);

-- entrenadores
create table entrenadores (
    id_entrenador serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    especialidad varchar(100) check (especialidad in ('Cardio', 'Fuerza', 'Flexibilidad', 'Crossfit', 'Pilates', 'Yoga')),
    fecha_contratacion date default current_date check (fecha_contratacion <= current_date),
    constraint uk_entrenador unique (nombre, apellido)
);

-- certificaciones_entrenador
create table certificaciones_entrenador (
    id_certificacion serial primary key,
    id_entrenador integer not null references entrenadores(id_entrenador),
    nombre_certificacion varchar(150) not null,
    institucion_emisora varchar(150) not null,
    fecha_obtencion date check (fecha_obtencion <= current_date),
    constraint uk_certificacion unique (id_entrenador, nombre_certificacion)
);

-- salas
create table salas (
    id_sala serial primary key,
    nombre_sala varchar(50) not null unique,
    capacidad smallint check (capacidad > 0),
    horario_apertura time not null,
    horario_cierre time not null,
    descripcion text,
    constraint chk_horario check (horario_cierre > horario_apertura)
);

-- equipos
create table equipos (
    id_equipo serial primary key,
    nombre_equipo varchar(100) not null,
    marca varchar(100) not null,
    modelo varchar(100) not null,
    id_sala integer references salas(id_sala),
    fecha_adquisicion date check (fecha_adquisicion <= current_date),
    estado varchar(50) not null check (estado in ('Nuevo', 'Bueno', 'Regular', 'Malo', 'Fuera de servicio')),
    constraint uk_equipo unique (nombre_equipo, marca, modelo)
);

-- ejercicios
create table ejercicios (
    id_ejercicio serial primary key,
    nombre_ejercicio varchar(100) not null unique,
    descripcion text not null,
    grupo_muscular varchar(50) not null check (grupo_muscular in ('Piernas', 'Brazos', 'Pecho', 'Espalda', 'Abdomen', 'Cardio')),
    tipo_ejercicio varchar(50) not null check (tipo_ejercicio in ('Aeróbico', 'Anaeróbico', 'Flexibilidad', 'Equilibrio')),
    id_equipo integer references equipos(id_equipo)
);

-- rutinas
create table rutinas (
    id_rutina serial primary key,
    nombre_rutina varchar(100) not null unique,
    descripcion text not null,
    nivel_dificultad varchar(30) not null check (nivel_dificultad in ('Principiante', 'Intermedio', 'Avanzado')),
    id_entrenador_creador integer not null references entrenadores(id_entrenador),
    duracion_estimada_min integer check (duracion_estimada_min > 0)
);

-- rutina_ejercicios
create table rutina_ejercicios (
    id_rutina_ejercicio serial primary key,
    id_rutina integer not null references rutinas(id_rutina),
    id_ejercicio integer not null references ejercicios(id_ejercicio),
    series smallint not null check (series > 0),
    repeticiones smallint check (repeticiones > 0),
    descanso_segundos smallint default 30 check (descanso_segundos >= 0),
    orden smallint not null check (orden > 0),
    notas text,
    constraint uk_rutina_ejercicio_orden unique (id_rutina, orden)
);

-- clases_grupales
create table clases_grupales (
    id_clase serial primary key,
    nombre_clase varchar(100) not null,
    id_entrenador integer not null references entrenadores(id_entrenador),
    id_sala integer not null references salas(id_sala),
    fecha_hora_inicio timestamp not null,
    duracion_min smallint not null check (duracion_min > 0),
    capacidad_max smallint not null check (capacidad_max > 0),
    tipo_clase varchar(50) not null check (tipo_clase in ('Spinning', 'Zumba', 'Pilates', 'Yoga', 'Crossfit', 'HIIT')),
    constraint uk_clase_horario unique (id_sala, fecha_hora_inicio),
    constraint chk_fecha_clase check (fecha_hora_inicio > current_timestamp)
);

-- socios_clases
create table socios_clases (
    id_socio_clase serial primary key,
    id_socio integer not null references socios(id_socio),
    id_clase integer not null references clases_grupales(id_clase),
    fecha_inscripcion timestamp default current_timestamp,
    asistio boolean default false,
    constraint uk_socio_clase unique (id_socio, id_clase)
);

-- registros_entrenamiento
create table registros_entrenamiento (
    id_registro serial primary key,
    id_socio integer not null references socios(id_socio),
    id_rutina integer references rutinas(id_rutina),
    fecha_hora_inicio timestamp not null default current_timestamp,
    fecha_hora_fin timestamp check (fecha_hora_fin > fecha_hora_inicio),
    calorias_quemadas smallint check (calorias_quemadas >= 0),
    satisfaccion smallint check (satisfaccion between 1 and 10),
    notas text
);

-- mediciones_corporales
create table mediciones_corporales (
    id_medicion serial primary key,
    id_socio integer not null references socios(id_socio),
    fecha_medicion date not null default current_date check (fecha_medicion <= current_date),
    peso_kg numeric(5,2) check (peso_kg > 0),
    altura_cm smallint check (altura_cm between 100 and 250),
    porcentaje_grasa numeric(5,2) check (porcentaje_grasa between 0 and 100),
    porcentaje_musculo numeric(5,2) check (porcentaje_musculo between 0 and 100),
    circunferencia_cintura_cm smallint check (circunferencia_cintura_cm > 0),
    constraint uk_socio_fecha unique (id_socio, fecha_medicion)
);