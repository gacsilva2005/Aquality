package com.hydrasense.schydrasense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hydrasense.schydrasense.model.SessaoDeTreino;

import java.util.List;
import java.util.Optional;

public interface SessaoDeTreinoRepository extends JpaRepository<SessaoDeTreino, Long> {
    List<SessaoDeTreino> findByAtletaId(Long atletaId);

    Optional<SessaoDeTreino> findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(Long atletaId);
}