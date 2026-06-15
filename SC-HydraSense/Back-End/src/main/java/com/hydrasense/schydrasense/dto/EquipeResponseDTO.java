package com.hydrasense.schydrasense.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Equipe;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EquipeResponseDTO {
    private Long id;
    private String nome;
    private String categoria;
    private Integer limiteAtletas;

    @JsonIgnoreProperties({"profissionais", "atletas"})
    private Clube clube;

    @JsonIgnoreProperties({"clube", "profissional", "registrosDeHidratacao", "sessoes"})
    private List<Atleta> atletas;

    private Integer activeAthletes;
    private Double adherence;
    private Double sweatRate;

    public EquipeResponseDTO(Equipe equipe, Double adherence, Double sweatRate) {
        this.id = equipe.getId();
        this.nome = equipe.getNome();
        this.categoria = equipe.getCategoria();
        this.limiteAtletas = equipe.getLimiteAtletas();
        this.clube = equipe.getClube();
        this.atletas = equipe.getAtletas();
        this.activeAthletes = equipe.getAtletas() != null ? equipe.getAtletas().size() : 0;
        this.adherence = adherence;
        this.sweatRate = sweatRate;
    }
}
