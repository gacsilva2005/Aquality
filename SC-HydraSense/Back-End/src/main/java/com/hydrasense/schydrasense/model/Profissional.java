package com.hydrasense.schydrasense.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@Entity
@Table(name = "profissional")
public class Profissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String registro;
    private String uf;
    private String especialidade;
    
    @Column(length = 20)
    private String sexo;

    @ManyToOne
    @JoinColumn(name = "clube_id")
    @JsonIgnoreProperties({"profissionais", "atletas"})
    private Clube clube;
    private String perfil;

    private String telefone;

    @Column(unique = true)
    private String email;

    private String senha;

    @Column(length = 300)
    private String resumo;

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL)
    private List<Atleta> atletas = new ArrayList<>();

    public Profissional() {
    }

    public void vincularAtleta(Atleta atleta) {
        atletas.add(atleta);
        atleta.setProfissional(this);
    }
}