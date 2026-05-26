package com.hydrasense.schydrasense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hydrasense.schydrasense.model.SessaoDeTreino;

import java.util.List;

public interface SessaoDeTreinoRepository extends JpaRepository<SessaoDeTreino, Long> {
    List<SessaoDeTreino> findByAtletaId(Long atletaId);
}