package com.hydrasense.schydrasense.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtletaResumoDTO {
    private Long id;
    private String nome;
    private String fotoPerfil;
    private String modalidade;
    private String equipeNome; // Lista de equipes separados por virgula ou a principal
    private String status; // Crítico, Atenção, Ideal, Sem Dados
    private String adesao; // Ex: "100%" ou "Alta"
    private LocalDateTime ultimaSessao;
}
