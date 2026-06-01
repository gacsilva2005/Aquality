package com.hydrasense.schydrasense.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Equipe")
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(nullable = false)
    private Integer limiteAtletas;

    @ManyToOne
    @JoinColumn(name = "clube_id", nullable = false)
    @JsonIgnoreProperties({"profissionais", "atletas"})
    private Clube clube;

    @ManyToMany
    @JoinTable(
        name = "atleta_equipe",
        joinColumns = @JoinColumn(name = "equipe_id"),
        inverseJoinColumns = @JoinColumn(name = "atleta_id")
    )
    @JsonIgnoreProperties({"clube", "profissional", "registrosDeHidratacao", "sessoes"})
    private List<Atleta> atletas = new ArrayList<>();

    public Equipe() {}
}
