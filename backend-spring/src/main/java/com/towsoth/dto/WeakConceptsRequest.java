package com.towsoth.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class WeakConceptsRequest {

    /**
     * Concept labels the student is weak on (from analytics / recursive learning).
     */
    @NotEmpty(message = "weakConcepts must not be empty")
    private List<String> weakConcepts;

    public WeakConceptsRequest() {
    }

    public WeakConceptsRequest(List<String> weakConcepts) {
        this.weakConcepts = weakConcepts;
    }

    public List<String> getWeakConcepts() {
        return weakConcepts;
    }

    public void setWeakConcepts(List<String> weakConcepts) {
        this.weakConcepts = weakConcepts;
    }
}
