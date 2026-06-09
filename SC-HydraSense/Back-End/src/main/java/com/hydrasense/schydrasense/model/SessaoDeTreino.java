package com.hydrasense.schydrasense.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import com.hydrasense.schydrasense.service.CalculadoraFisiologica;

@Getter
@Entity
public class SessaoDeTreino {

    // Getters e Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private LocalDateTime dataHoraInicio;

    @Setter
    private LocalDateTime dataHoraFim;

    @Setter
    private Float distanciaPercorrida;

    @Setter
    private String modalidade;

    @Setter
    private String intensidadePercebida;

    @Setter
    private Float taxaSudorese;

    @Setter
    private Float balancoHidrico;

    @Setter
    @ManyToOne
    @JoinColumn(name = "kit_id")
    private Kit kit;

    @Setter
    private Boolean usouEquipamento;

    // Relação 1:1 Registro de Sintoma
    @Setter
    @OneToOne(mappedBy = "sessaoDeTreino", cascade = CascadeType.ALL)
    private RegistroDeSintoma registroDeSintoma;

    // Relação 1:1 Condição Ambiental
    @Setter
    @OneToOne(mappedBy = "sessaoDeTreino", cascade = CascadeType.ALL)
    private CondicaoAmbiental condicaoAmbiental;

    // Relação 1:1 Avaliação Basal
    @Setter
    @OneToOne(mappedBy = "sessaoDeTreino", cascade = CascadeType.ALL)
    private AvaliacaoBasal avaliacaoBasal;

    // Relação 1:1 Medição de Eletrólitos
    @Setter
    @OneToOne(mappedBy = "sessaoDeTreino", cascade = CascadeType.ALL)
    private MedicaoEletrolitos medicaoEletrolitos;

    // Relação 1:1 Pesagem Pré-Treino
    @Setter
    @OneToOne
    @JoinColumn(name = "pesagem_pre_id", referencedColumnName = "id")
    private RegistroDoPeso pesagemPre;

    // Relação 1:1 Pesagem Pós-Treino
    @Setter
    @OneToOne
    @JoinColumn(name = "pesagem_pos_id", referencedColumnName = "id")
    private RegistroDoPeso pesagemPos;

    // Relação 1:1 Registro de Hidratação
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "registro_hidratacao_id", referencedColumnName = "id")
    private RegistroDeHidratacao registroDeHidratacao;

    // Relação M:1 com Atleta
    @ManyToOne
    @JoinColumn(name = "atleta_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Atleta atleta;

    // ── Checklist pré sessão
    @Setter
    private Boolean checklistBexiga;

    @Setter
    private Boolean checklistBalancaCorreta;

    @Setter
    private Boolean checklistSuperficiePlana;

    @Setter
    private Boolean checklistVestimentaCorreta;

    @Setter
    private Boolean checklistSemCalcados;

    @Setter
    private Boolean checklistSemAcessorios;

    // Construtor padrão JPA
    public SessaoDeTreino() {}

    //Métodos da Classe

    public void iniciarTreino() {
        this.dataHoraInicio = LocalDateTime.now();
    }

    public void finalizarTreino() {
        this.dataHoraFim = LocalDateTime.now();
    }

    public Float getDescontoKitKg() {
        if (Boolean.TRUE.equals(usouEquipamento) && kit != null && kit.getPesoTotal() != null) {
            return kit.getPesoTotal() / 1000f; // converte gramas → kg
        }
        return 0f;
    }

    public void finalizar(
            RegistroDoPeso pesagemPos,
            RegistroDeHidratacao hidratacao,
            Integer duracaoSegundos,
            CalculadoraFisiologica calculadora
    ) {
        this.pesagemPos = pesagemPos;
        this.registroDeHidratacao = hidratacao;

        if (duracaoSegundos != null && duracaoSegundos > 0) {
            this.dataHoraFim = this.dataHoraInicio.plusSeconds(duracaoSegundos);
        } else {
            finalizarTreino();
        }

        Float descontoKg = getDescontoKitKg();

        Float pesoPreVal = (this.pesagemPre != null)
                ? this.pesagemPre.getPeso() - descontoKg
                : 0.0f;

        Float pesoPosVal = (this.pesagemPos != null)
                ? this.pesagemPos.getPeso() - descontoKg
                : 0.0f;

        Integer volumeHidratacao = (this.registroDeHidratacao != null)
                ? this.registroDeHidratacao.getVolume().intValue()
                : 0;

        Double duracaoMinutosPrecisos = (duracaoSegundos != null && duracaoSegundos > 0)
                ? duracaoSegundos / 60.0
                : (double) this.calcularDuracaoTotal();

        this.taxaSudorese = calculadora.calcularTaxaSudorese(
                pesoPreVal, pesoPosVal, volumeHidratacao, duracaoMinutosPrecisos);
        this.balancoHidrico = calculadora.calcularBalancoHidrico(pesoPreVal, pesoPosVal);
    }

    public long calcularDuracaoTotal() {
        if (dataHoraInicio != null && dataHoraFim != null) {
            return java.time.Duration.between(dataHoraInicio, dataHoraFim).toMinutes();
        }
        return 0;
    }

    public void setAtleta(Atleta atleta) {
        this.atleta = atleta;
    }
}