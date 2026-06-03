package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
public class Kit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String nome;

    @Setter
    private String modalidade;

    @Setter
    private Float pesoTotal;

    @Setter
    @ManyToOne
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;

    public Kit() {}

    public Kit(String nome, String modalidade, Float pesoTotal, Atleta atleta) {
        this.nome = nome;
        this.modalidade = modalidade;
        this.pesoTotal = pesoTotal;
        this.atleta = atleta;
    }
}