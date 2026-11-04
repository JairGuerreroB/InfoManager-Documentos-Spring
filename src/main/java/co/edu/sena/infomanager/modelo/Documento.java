package co.edu.sena.infomanager.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Documento almacenado en el sistema. Hibernate lo asocia con la tabla documentos:
 * cada atributo corresponde a una columna y las llaves foráneas se convierten en relaciones
 * hacia la categoría y el usuario que lo subió.
 */
@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer idDocumento;

    @Column(name = "titulo", nullable = false, length = 100)
    private String titulo;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    // LAZY: la categoría solo se consulta cuando realmente se necesita
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaDocumento categoria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    /** Nombre con el que el archivo quedó guardado en el almacén (no el nombre original). */
    @Column(name = "ruta_archivo", nullable = false, length = 255)
    private String rutaArchivo;

    @Column(name = "fecha_subida", nullable = false, updatable = false)
    private LocalDateTime fechaSubida;

    /** Fecha en la que el documento vence; null si no tiene vencimiento. */
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Convert(converter = EstadoDocumentoConverter.class)
    @Column(name = "estado", nullable = false)
    private EstadoDocumento estado = EstadoDocumento.ACTIVO;

    /** Se ejecuta justo antes del INSERT: registra la fecha y hora de subida. */
    @PrePersist
    void antesDeGuardar() {
        if (fechaSubida == null) {
            fechaSubida = LocalDateTime.now();
        }
    }

    public Integer getIdDocumento() {
        return idDocumento;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public CategoriaDocumento getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaDocumento categoria) {
        this.categoria = categoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    public LocalDateTime getFechaSubida() {
        return fechaSubida;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public EstadoDocumento getEstado() {
        return estado;
    }

    public void setEstado(EstadoDocumento estado) {
        this.estado = estado;
    }
}
