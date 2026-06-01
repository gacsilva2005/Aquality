package com.hydrasense.schydrasense.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EquipeRequestDTO {
    private String nome;
    private String categoria;
    private Integer limiteAtletas;
    private Long clubeId;
    private List<Long> atletasIds;
}
