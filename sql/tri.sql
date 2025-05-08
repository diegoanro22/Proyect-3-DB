CREATE OR REPLACE FUNCTION actualizar_duracion_rutina()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rutinas
    SET duracion_estimada_min = (
        SELECT COALESCE(SUM(series * repeticiones * 5 + descanso_segundos), 0) / 60
        FROM rutina_ejercicios
        WHERE id_rutina = NEW.id_rutina
    )
    WHERE id_rutina = NEW.id_rutina;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_actualizar_duracion
AFTER INSERT OR UPDATE OR DELETE ON rutina_ejercicios
FOR EACH ROW EXECUTE FUNCTION actualizar_duracion_rutina();

CREATE OR REPLACE FUNCTION verificar_capacidad_clase()
RETURNS TRIGGER AS $$
DECLARE
    capacidad_actual INTEGER;
    capacidad_maxima INTEGER;
BEGIN
    SELECT COUNT(*) INTO capacidad_actual
    FROM socios_clases
    WHERE id_clase = NEW.id_clase;
    
    SELECT capacidad_max INTO capacidad_maxima
    FROM clases_grupales
    WHERE id_clase = NEW.id_clase;
    
    IF capacidad_actual >= capacidad_maxima THEN
        RAISE EXCEPTION 'La clase ha alcanzado su capacidad máxima de % participantes', capacidad_maxima;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_verificar_capacidad
BEFORE INSERT ON socios_clases
FOR EACH ROW EXECUTE FUNCTION verificar_capacidad_clase();
