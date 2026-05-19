package com.hydrasense.schydrasense.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Atleta")
public class Atleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(length = 100, unique = true)
    private String email;

    @Column(length = 100)
    private String modalidade;

    @Column(nullable = false, length = 50)
    private String modalidadePrincipal;

    @Column(nullable = false)
    private Double pesoAtual;

    @Column
    private Float altura;

    private String senha;

    @ManyToOne
    @JoinColumn(name = "clube_id")
    @JsonBackReference
    private Clube clube;

    private String codigoAcesso;

    private Boolean ativado = false;

    //Relação 1:M com Profissional
    @ManyToOne
    @JoinColumn(name = "profissional_id")
    @JsonIgnore
    private Profissional profissional;

    // Relação 1:0..1 com Registro de Hidratação
    @Setter
    @OneToOne(mappedBy = "atleta", cascade = CascadeType.ALL)
    private RegistroDeHidratacao registroDeHidratacao;

    // Relação sessões
    @JsonIgnore
    @OneToMany(mappedBy = "atleta", cascade = CascadeType.ALL)
    private List<SessaoDeTreino> sessoes = new ArrayList<>();

    // Construtor padrão JPA
    public Atleta() {}

    public Atleta(String nome,
                  LocalDate dataNascimento,
                  String email,
                  String modalidade,
                  String modalidadePrincipal,
                  Double pesoAtual,
                  Float altura) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.modalidade = modalidade;
        this.modalidadePrincipal = modalidadePrincipal;
        this.pesoAtual = pesoAtual;
        this.altura = altura;
    }

    public void adicionarSessao(SessaoDeTreino sessao) {
        sessoes.add(sessao);
        sessao.setAtleta(this);
    }
}