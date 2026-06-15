package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {
    List<Equipe> findByClubeId(Long clubeId);
    List<Equipe> findByAtletas_Id(Long atletaId);
}
