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
('lucas', 'pereira', '1991-04-21', '5556789012', 'lucas.p@mail.com', 1, '2023-06-10 12:00:00', true, 'gusta yoga'),
('camila', 'ruiz', '1993-10-30', '5557890123', 'camila.r@mail.com', 2, '2023-06-18 09:00:00', false, 'viaje prolongado'),
('matías', 'santos', '1996-02-14', '5558901234', 'matias.s@mail.com', 3, '2023-07-01 14:45:00', true, null),
('valentina', 'torres', '1998-06-08', '5559012345', 'valen.t@mail.com', 1, '2023-07-15 17:20:00', true, null),
('diego', 'ramírez', '1990-01-25', '5550123456', 'diego.r@mail.com', 2, '2023-08-01 08:30:00', true, 'entrena con pesas'),
('antonio', 'ferrari', '1984-09-17', '5551122334', 'antonio.f@mail.com', 1, '2023-08-10 10:15:00', false, 'pendiente de pago'),
('laura', 'castro', '1997-07-03', '5552233445', 'laura.c@mail.com', 2, '2023-08-20 11:50:00', true, null),
('sebastián', 'paz', '1992-05-19', '5553344556', 'sebastian.p@mail.com', 3, '2023-09-01 13:10:00', true, null),
('paula', 'vargas', '1989-03-11', '5554455667', 'paula.v@mail.com', 1, '2023-09-05 16:40:00', true, 'le interesa pilates'),
('tomas', 'aguilar', '1994-12-27', '5555566778', 'tomas.a@mail.com', 2, '2023-09-12 18:15:00', false, 'canceló por lesión'),
('julieta', 'mendoza', '1996-08-16', '5556677889', 'julieta.m@mail.com', 3, '2023-09-22 15:30:00', true, null),
('marcos', 'silva', '1987-11-08', '5557788990', 'marcos.s@mail.com', 1, '2023-10-03 07:00:00', true, 'rutina personalizada'),
('carla', 'reyes', '1993-01-13', '5558899001', 'carla.r@mail.com', 2, '2023-10-10 09:40:00', true, null),
('ignacio', 'morales', '1986-06-21', '5559900112', 'ignacio.m@mail.com', 3, '2023-10-20 11:25:00', false, 'viaje al exterior'),
('martina', 'vera', '1999-04-04', '5551011123', 'martina.v@mail.com', 1, '2023-11-01 10:00:00', true, 'clases de zumba'),
('franco', 'arias', '1995-08-09', '5552122234', 'franco.a@mail.com', 2, '2023-11-12 13:45:00', true, null),
('florencia', 'acosta', '1991-02-28', '5553233345', 'flor.a@mail.com', 1, '2023-11-20 17:10:00', true, 'dolor de espalda'),
('gabriel', 'sosa', '1989-10-01', '5554344456', 'gabriel.s@mail.com', 3, '2023-12-01 08:50:00', true, null),
('noelia', 'blanco', '1994-05-06', '5555455567', 'noe.b@mail.com', 2, '2023-12-10 12:30:00', false, 'suspendida por deuda'),
('facundo', 'mora', '1997-09-14', '5556566678', 'facu.m@mail.com', 1, '2023-12-22 15:20:00', true, null),
('agustina', 'rios', '1993-03-03', '5557677789', 'agus.r@mail.com', 2, '2024-01-03 14:00:00', true, 'le gusta entrenar en grupo'),
('nicolás', 'benítez', '1990-07-27', '5558788890', 'nico.b@mail.com', 3, '2024-01-10 09:30:00', true, null),
('romina', 'salas', '1988-11-13', '5559899901', 'romi.s@mail.com', 1, '2024-01-20 11:10:00', true, 'embarazada'),
('emanuel', 'gutiérrez', '1992-01-05', '5550900011', 'emanuel.g@mail.com', 2, '2024-01-28 16:45:00', false, 'suspendió por enfermedad'),
('milagros', 'navarro', '1998-10-23', '5551011223', 'mili.n@mail.com', 3, '2024-02-05 10:00:00', true, null),
('damián', 'ibáñez', '1987-06-18', '5552122334', 'damian.i@mail.com', 1, '2024-02-14 09:00:00', true, 'entrena con entrenador personal'),
('jazmín', 'montoya', '1995-09-01', '5553233445', 'jazmin.m@mail.com', 2, '2024-02-25 13:20:00', true, null),
('rodrigo', 'luna', '1996-11-19', '5554344556', 'rodrigo.l@mail.com', 3, '2024-03-03 15:00:00', false, 'renovará en abril'),
('melina', 'santana', '1994-05-25', '5555455667', 'melina.s@mail.com', 1, '2024-03-10 16:30:00', true, null),
('jorge', 'cabrera', '1985-12-30', '5556566778', 'jorge.c@mail.com', 2, '2024-03-21 08:20:00', true, null),
('luciana', 'muñoz', '1991-08-11', '5557677889', 'luciana.m@mail.com', 3, '2024-04-01 10:10:00', true, null),
('fernando', 'cortés', '1986-04-17', '5558788990', 'fer.c@mail.com', 1, '2024-04-10 14:30:00', false, 'pendiente de médico'),
('micaela', 'maldonado', '1992-06-02', '5559899001', 'mica.m@mail.com', 2, '2024-04-22 15:45:00', true, null),
('alejandro', 'bustos', '1989-02-07', '5550901123', 'ale.b@mail.com', 3, '2024-05-03 17:15:00', true, 'entrena con su esposa'),
('celeste', 'arrieta', '1996-07-20', '5551012234', 'celeste.a@mail.com', 1, '2024-05-14 18:30:00', true, null),
('ricardo', 'esquivel', '1993-09-05', '5552123345', 'ricardo.e@mail.com', 2, '2024-05-25 09:30:00', true, null),
('yesica', 'ospina', '1997-01-31', '5553234456', 'yesica.o@mail.com', 3, '2024-06-01 12:00:00', false, 'viaje de trabajo'),
('ramiro', 'valdez', '1988-10-18', '5554345567', 'ramiro.v@mail.com', 1, '2024-06-10 13:50:00', true, null),
('carolina', 'ibarra', '1990-12-22', '5555456678', 'caro.i@mail.com', 2, '2024-06-18 11:45:00', true, null),
('enzo', 'molina', '1994-03-09', '5556567789', 'enzo.m@mail.com', 3, '2024-06-28 08:30:00', true, 'le gusta crossfit'),
('natalia', 'sierra', '1991-05-29', '5557678890', 'nati.s@mail.com', 1, '2024-07-07 10:20:00', true, null),
('santiago', 'campos', '1986-09-14', '5558789901', 'santi.c@mail.com', 2, '2024-07-15 13:10:00', false, 'baja médica'),
('elena', 'bazán', '1995-02-24', '5559890012', 'elena.b@mail.com', 3, '2024-07-25 15:40:00', true, null),
('adrián', 'castillo', '1993-06-17', '5550901234', 'adrian.c@mail.com', 1, '2024-08-01 17:00:00', true, 'entrena con amigos'),
('berenice', 'quiroga', '1998-08-30', '5551012345', 'bere.q@mail.com', 2, '2024-08-12 10:15:00', true, null);

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