-- ddl.sql

-- planes_membresia
create table planes_membresia (
    id_plan serial primary key,
    nombre_plan varchar(50) not null,
    descripcion text,
    precio_mensual numeric(10,2),
    acceso_24h boolean default false,
    incluye_clases_grupales boolean default false
);

-- socios
create table socios (
    id_socio serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    fecha_nacimiento date,
    telefono varchar(20),
    email varchar(100),
    id_plan integer references planes_membresia(id_plan),
    fecha_inscripcion timestamp default current_timestamp,
    activo boolean default true,
    notas text
);

-- entrenadores
create table entrenadores (
    id_entrenador serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    especialidad varchar(100),
    fecha_contratacion date
);

-- certificaciones_entrenador
create table certificaciones_entrenador (
    id_certificacion serial primary key,
    id_entrenador integer not null references entrenadores(id_entrenador),
    nombre_certificacion varchar(150) not null,
    institucion_emisora varchar(150),
    fecha_obtencion date
);

-- salas
create table salas (
    id_sala serial primary key,
    nombre_sala varchar(50) not null,
    capacidad smallint,
    horario_apertura time,
    horario_cierre time,
    descripcion text
);

-- equipos
create table equipos (
    id_equipo serial primary key,
    nombre_equipo varchar(100) not null,
    marca varchar(100),
    modelo varchar(100),
    id_sala integer references salas(id_sala),
    fecha_adquisicion date,
    estado varchar(50)
);

-- ejercicios
create table ejercicios (
    id_ejercicio serial primary key,
    nombre_ejercicio varchar(100) not null,
    descripcion text,
    grupo_muscular varchar(50),
    tipo_ejercicio varchar(50),
    id_equipo integer references equipos(id_equipo)
);

-- rutinas
create table rutinas (
    id_rutina serial primary key,
    nombre_rutina varchar(100) not null,
    descripcion text,
    nivel_dificultad varchar(30),
    id_entrenador_creador integer references entrenadores(id_entrenador),
    duracion_estimada_min integer
);

-- rutina_ejercicios (tabla de cruce n:m)
create table rutina_ejercicios (
    id_rutina_ejercicio serial primary key,
    id_rutina integer not null references rutinas(id_rutina),
    id_ejercicio integer not null references ejercicios(id_ejercicio),
    series smallint not null,
    repeticiones smallint,
    descanso_segundos smallint,
    orden smallint not null,
    notas text
);

-- clases_grupales
create table clases_grupales (
    id_clase serial primary key,
    nombre_clase varchar(100) not null,
    id_entrenador integer not null references entrenadores(id_entrenador),
    id_sala integer not null references salas(id_sala),
    fecha_hora_inicio timestamp not null,
    duracion_min smallint not null,
    capacidad_max smallint,
    tipo_clase varchar(50) not null
);

-- socios_clases (tabla de cruce n:m)
create table socios_clases (
    id_socio_clase serial primary key,
    id_socio integer not null references socios(id_socio),
    id_clase integer not null references clases_grupales(id_clase),
    fecha_inscripcion timestamp default current_timestamp,
    asistio boolean default false
);

-- registros_entrenamiento
create table registros_entrenamiento (
    id_registro serial primary key,
    id_socio integer not null references socios(id_socio),
    id_rutina integer references rutinas(id_rutina),
    fecha_hora_inicio timestamp not null,
    fecha_hora_fin timestamp,
    calorias_quemadas smallint,
    satisfaccion smallint,
    notas text
);

-- mediciones_corporales
create table mediciones_corporales (
    id_medicion serial primary key,
    id_socio integer not null references socios(id_socio),
    fecha_medicion date default current_date,
    peso_kg numeric(5,2),
    altura_cm smallint,
    porcentaje_grasa numeric(5,2),
    porcentaje_musculo numeric(5,2),
    circunferencia_cintura_cm smallint
);