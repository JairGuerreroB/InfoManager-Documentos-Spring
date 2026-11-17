package co.edu.sena.infomanager.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Utilidad para almacenar contraseñas de forma segura: nunca se guarda el texto plano,
 * sino un hash PBKDF2 con una "sal" aleatoria distinta por usuario.
 *
 * Formato almacenado en la columna {@code usuarios.contrasena}:
 * {@code iteraciones:sal(Base64):hash(Base64)}
 */
public final class ContrasenaUtil {

    private static final String ALGORITMO = "PBKDF2WithHmacSHA256";
    private static final int ITERACIONES = 65536;
    private static final int LONGITUD_CLAVE_BITS = 256;
    private static final int LONGITUD_SAL_BYTES = 16;
    private static final String SEPARADOR = ":";

    private ContrasenaUtil() {
        // Clase utilitaria: no se instancia.
    }

    /**
     * Genera el hash de una contraseña para guardarlo en la base de datos.
     *
     * @param contrasena contraseña en texto plano
     * @return cadena con iteraciones, sal y hash
     */
    public static String generarHash(String contrasena) {
        byte[] sal = new byte[LONGITUD_SAL_BYTES];
        new SecureRandom().nextBytes(sal);
        byte[] hash = calcularHash(contrasena.toCharArray(), sal, ITERACIONES);
        return ITERACIONES + SEPARADOR
                + Base64.getEncoder().encodeToString(sal) + SEPARADOR
                + Base64.getEncoder().encodeToString(hash);
    }

    /**
     * Comprueba si una contraseña coincide con el hash almacenado.
     *
     * @param contrasena       contraseña escrita por el usuario
     * @param hashAlmacenado   valor guardado en la base de datos
     * @return {@code true} si coinciden
     */
    public static boolean verificar(String contrasena, String hashAlmacenado) {
        if (contrasena == null || hashAlmacenado == null) {
            return false;
        }
        String[] partes = hashAlmacenado.split(SEPARADOR);
        if (partes.length != 3) {
            return false;
        }
        try {
            int iteraciones = Integer.parseInt(partes[0]);
            byte[] sal = Base64.getDecoder().decode(partes[1]);
            byte[] esperado = Base64.getDecoder().decode(partes[2]);
            byte[] obtenido = calcularHash(contrasena.toCharArray(), sal, iteraciones);
            return MessageDigest.isEqual(esperado, obtenido);
        } catch (IllegalArgumentException e) {
            // Formato inválido (número o Base64 mal formado).
            return false;
        }
    }

    private static byte[] calcularHash(char[] contrasena, byte[] sal, int iteraciones) {
        try {
            PBEKeySpec especificacion = new PBEKeySpec(contrasena, sal, iteraciones, LONGITUD_CLAVE_BITS);
            return SecretKeyFactory.getInstance(ALGORITMO).generateSecret(especificacion).getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException("No se pudo calcular el hash de la contraseña.", e);
        }
    }
}
