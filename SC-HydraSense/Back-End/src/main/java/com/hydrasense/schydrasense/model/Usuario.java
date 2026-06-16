package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String nome;

    @Setter
    @Column(unique = true)
    private String email;

    @Setter
    private String foto;

    @Setter
    private String provider;

    public Usuario() {
    }

    public Usuario(String nome, String email, String foto, String provider) {
        this.nome = nome;
        this.email = email;
        this.foto = foto;
        this.provider = provider;
    }

}