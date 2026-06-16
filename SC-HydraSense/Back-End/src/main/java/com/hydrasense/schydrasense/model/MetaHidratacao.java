package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "meta_hidratacao")
public class MetaHidratacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meta_volume_ml", nullable = false)
    private Integer metaVolumeMl = 3000;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @OneToOne
    @JoinColumn(name = "atleta_id", unique = true, nullable = false)
    private Atleta atleta;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private Profissional profissional;

    public MetaHidratacao() {}

    public MetaHidratacao(Integer metaVolumeMl, String observacoes, Atleta atleta, Profissional profissional) {
        this.metaVolumeMl = metaVolumeMl;
        this.observacoes = observacoes;
        this.atleta = atleta;
        this.profissional = profissional;
    }
}
