package co.edu.sena.infomanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada del módulo de documentos de InfoManager System.
 * Spring Boot inicia el servidor Tomcat integrado, busca las clases anotadas
 * dentro de este paquete y configura la conexión a MySQL con Hibernate.
 */
@SpringBootApplication
public class InfoManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfoManagerApplication.class, args);
    }
}
