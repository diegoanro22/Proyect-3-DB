-- dml.sql

-- planes_membresia
insert into planes_membresia (nombre_plan, descripcion, precio_mensual, acceso_24h, incluye_clases_grupales) values
('básico', 'acceso a equipos básicos', 30.00, false, false),
('estándar', 'acceso completo sin clases', 45.00, true, false),
('premium', 'acceso completo con clases ilimitadas', 60.00, true, true),
('nocturno', 'acceso después de las 20:00', 35.00, false, false),
('fines de semana', 'solo sábados y domingos', 25.00, false, false);

-- socios
insert into socios (nombre, apellido, fecha_nacimiento, telefono, email, id_plan, fecha_inscripcion, activo, notas) values
('maría', 'gómez', '1990-05-15', '5551234567', 'maria.g@mail.com', 3, '2023-01-10 09:30:00', true, 'prefiere entrenamiento matutino'),
('carlos', 'lópez', '1985-11-22', '5552345678', 'carlos.l@mail.com', 2, '2023-02-15 14:20:00', true, null),
('ana', 'martínez', '1995-03-08', '5553456789', 'ana.m@mail.com', 1, '2023-03-05 18:00:00', false, 'suspendió membresía'),
('juan', 'díaz', '1988-07-30', '5554567890', 'juan.d@mail.com', 3, '2023-04-20 11:15:00', true, 'alergia al látex'),
('sofía', 'hernández', '1992-09-12', '5555678901', 'sofia.h@mail.com', 2, '2023-05-01 16:45:00', true, null);

-- entrenadores
insert into entrenadores (nombre, apellido, especialidad, fecha_contratacion) values
('luis', 'rodríguez', 'fuerza', '2020-06-15'),
('patricia', 'vargas', 'cardio', '2021-03-10'),
('ricardo', 'mendoza', 'crossfit', '2022-01-20'),
('isabel', 'castro', 'yoga', '2022-05-05'),
('jorge', 'silva', 'rehabilitación', '2023-02-28');

-- certificaciones_entrenador
insert into certificaciones_entrenador (id_entrenador, nombre_certificacion, institucion_emisora, fecha_obtencion) values
(1, 'entrenador profesional de fuerza', 'federación internacional de fitness', '2019-05-20'),
(1, 'nutrición deportiva', 'academia de entrenadores', '2020-02-15'),
(2, 'especialista en cardio', 'instituto del deporte', '2021-01-10'),
(3, 'entrenador de crossfit nivel 2', 'crossfit inc.', '2021-11-05'),
(4, 'instructor de yoga avanzado', 'escuela internacional de yoga', '2022-03-18');

-- salas
insert into salas (nombre_sala, capacidad, horario_apertura, horario_cierre, descripcion) values
('sala de pesas', 20, '06:00:00', '22:00:00', 'equipos de musculación'),
('cardio', 15, '06:00:00', '22:00:00', 'cintas, elípticas y bicicletas'),
('crossfit', 10, '07:00:00', '21:00:00', 'área funcional'),
('yoga', 12, '08:00:00', '20:00:00', 'sala con espejos y colchonetas'),
('spinning', 8, '07:00:00', '21:00:00', 'clases grupales de ciclismo');

-- equipos
insert into equipos (nombre_equipo, marca, modelo, id_sala, fecha_adquisicion, estado) values
('press banca', 'hammer strength', 'pro', 1, '2022-01-15', 'excelente'),
('cinta correr', 'life fitness', 't5', 2, '2022-03-10', 'bueno'),
('rack power', 'rogue', 'rml-390', 3, '2022-05-20', 'nuevo'),
('bicicleta spinning', 'stages', 'sc3', 5, '2022-07-05', 'excelente'),
('mancuernas', 'ufc', 'rubber hex', 1, '2022-02-28', 'regular');

-- ejercicios
insert into ejercicios (nombre_ejercicio, descripcion, grupo_muscular, tipo_ejercicio, id_equipo) values
('press banca', 'press horizontal con barra', 'pectoral', 'fuerza', 1),
('sentadilla', 'sentadilla con barra', 'piernas', 'fuerza', 3),
('correr', 'cinta de correr', 'cardio', 'resistencia', 2),
('curl bíceps', 'con mancuernas', 'brazos', 'fuerza', 5),
('spinning', 'clase grupal', 'cardio', 'resistencia', 4);

-- rutinas
insert into rutinas (nombre_rutina, descripcion, nivel_dificultad, id_entrenador_creador, duracion_estimada_min) values
('principiantes', 'rutina básica de adaptación', 'fácil', 1, 45),
('fuerza total', 'desarrollo muscular completo', 'intermedio', 1, 60),
('quemagrasas', 'combinación cardio y fuerza', 'intermedio', 2, 50),
('crossfit base', 'entrenamiento funcional', 'difícil', 3, 55),
('tonificación', 'para definir musculatura', 'intermedio', 4, 40);

-- rutina_ejercicios
insert into rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, descanso_segundos, orden, notas) values
(1, 1, 3, 10, 60, 1, 'peso moderado'),
(1, 2, 3, 12, 60, 2, 'mantener técnica'),
(2, 1, 4, 8, 90, 1, 'peso alto'),
(2, 3, 2, 15, 45, 3, 'ritmo constante'),
(3, 4, 3, 12, 60, 2, 'alternar brazos');

-- clases_grupales
insert into clases_grupales (nombre_clase, id_entrenador, id_sala, fecha_hora_inicio, duracion_min, capacidad_max, tipo_clase) values
('spinning intenso', 2, 5, '2023-06-01 08:00:00', 45, 8, 'cardio'),
('yoga matutino', 4, 4, '2023-06-01 07:00:00', 60, 12, 'relajación'),
('crossfit avanzado', 3, 3, '2023-06-02 18:00:00', 55, 10, 'funcional'),
('pilates', 5, 4, '2023-06-03 10:00:00', 50, 10, 'tonificación'),
('hiit', 2, 2, '2023-06-04 09:00:00', 30, 15, 'cardio');

-- socios_clases
insert into socios_clases (id_socio, id_clase, fecha_inscripcion, asistio) values
(1, 1, '2023-05-28 10:00:00', true),
(1, 3, '2023-05-29 12:00:00', false),
(2, 2, '2023-05-30 09:00:00', true),
(4, 1, '2023-05-31 14:00:00', true),
(5, 4, '2023-06-01 08:30:00', null);

-- registros_entrenamiento
insert into registros_entrenamiento (id_socio, id_rutina, fecha_hora_inicio, fecha_hora_fin, calorias_quemadas, satisfaccion, notas) values
(1, 1, '2023-06-01 07:00:00', '2023-06-01 08:00:00', 350, 8, 'buen rendimiento'),
(2, 2, '2023-06-01 17:00:00', '2023-06-01 18:30:00', 500, 7, 'cansancio acumulado'),
(3, null, '2023-06-02 09:00:00', '2023-06-02 10:00:00', 400, 6, 'entrenamiento libre'),
(4, 3, '2023-06-02 19:00:00', '2023-06-02 20:00:00', 450, 9, null),
(5, 4, '2023-06-03 08:00:00', '2023-06-03 09:00:00', 380, 8, 'mejorando técnica');

-- mediciones_corporales
insert into mediciones_corporales (id_socio, fecha_medicion, peso_kg, altura_cm, porcentaje_grasa, porcentaje_musculo, circunferencia_cintura_cm) values
(1, '2023-01-10', 68.5, 165, 22.3, 35.2, 78),
(1, '2023-04-10', 65.0, 165, 19.8, 37.5, 74),
(2, '2023-02-15', 82.3, 180, 25.1, 33.7, 92),
(3, '2023-03-05', 59.8, 158, 28.5, 32.0, 70),
(4, '2023-04-20', 75.2, 175, 20.7, 38.2, 82);