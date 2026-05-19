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
@Table(name = "Clube")
public class Clube {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @OneToMany(mappedBy = "clube", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("clube")
    private List<Atleta> atletas = new ArrayList<>();

    @OneToMany(mappedBy = "clube", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("clube")
    private List<Profissional> profissionais = new ArrayList<>();

    public Clube() {}

    public Clube(String nome, String codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }
}
