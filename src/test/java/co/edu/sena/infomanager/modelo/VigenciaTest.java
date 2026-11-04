package co.edu.sena.infomanager.modelo;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/** Pruebas de la regla de vigencia: no necesitan base de datos ni servidor. */
class VigenciaTest {

    private static final LocalDate HOY = LocalDate.of(2026, 11, 4);
    private static final int DIAS_AVISO = 30;

    @Test
    void sinFechaNoTieneVencimiento() {
        assertEquals(Vigencia.SIN_VENCIMIENTO, Vigencia.calcular(null, HOY, DIAS_AVISO));
    }

    @Test
    void fechaAnteriorAHoyEstaVencida() {
        assertEquals(Vigencia.VENCIDO, Vigencia.calcular(HOY.minusDays(1), HOY, DIAS_AVISO));
    }

    @Test
    void venceHoyEstaPorVencer() {
        assertEquals(Vigencia.POR_VENCER, Vigencia.calcular(HOY, HOY, DIAS_AVISO));
    }

    @Test
    void justoEnElLimiteDelAvisoEstaPorVencer() {
        assertEquals(Vigencia.POR_VENCER, Vigencia.calcular(HOY.plusDays(30), HOY, DIAS_AVISO));
    }

    @Test
    void pasadoElLimiteDelAvisoEstaVigente() {
        assertEquals(Vigencia.VIGENTE, Vigencia.calcular(HOY.plusDays(31), HOY, DIAS_AVISO));
    }

    @Test
    void diasRestantesPuedeSerNegativoONulo() {
        assertEquals(-3L, Vigencia.diasRestantes(HOY.minusDays(3), HOY));
        assertEquals(10L, Vigencia.diasRestantes(HOY.plusDays(10), HOY));
        assertNull(Vigencia.diasRestantes(null, HOY));
    }
}
