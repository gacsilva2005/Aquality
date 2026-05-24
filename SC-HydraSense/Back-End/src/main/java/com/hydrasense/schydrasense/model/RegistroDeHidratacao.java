package com.hydrasense.schydrasense.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class RegistroDeHidratacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Float volume;
    private String tipoFluido;
    private LocalDateTime dataHora;
    
    @ManyToOne
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;

    @OneToOne(mappedBy = "registroDeHidratacao")
    @JsonIgnore
    private SessaoDeTreino sessaoDeTreino;
}