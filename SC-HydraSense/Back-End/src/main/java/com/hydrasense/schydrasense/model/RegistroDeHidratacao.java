package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class RegistroDeHidratacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Float volume;
    private String tipoFluido;
    
    @ManyToOne
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;
}