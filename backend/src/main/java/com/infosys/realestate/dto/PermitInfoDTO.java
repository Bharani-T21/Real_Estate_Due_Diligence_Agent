package com.infosys.realestate.dto;

public class PermitInfoDTO {
    private Long propertyId;
    private String buildingPermit;
    private String environmentalRisk;
    private String esaPhase;
    private String observations;

    public PermitInfoDTO(Long propertyId, String buildingPermit, String environmentalRisk, String esaPhase, String observations) {
        this.propertyId = propertyId;
        this.buildingPermit = buildingPermit;
        this.environmentalRisk = environmentalRisk;
        this.esaPhase = esaPhase;
        this.observations = observations;
    }
    // Getters and Setters
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    public String getBuildingPermit() { return buildingPermit; }
    public void setBuildingPermit(String buildingPermit) { this.buildingPermit = buildingPermit; }
    public String getEnvironmentalRisk() { return environmentalRisk; }
    public void setEnvironmentalRisk(String environmentalRisk) { this.environmentalRisk = environmentalRisk; }
    public String getEsaPhase() { return esaPhase; }
    public void setEsaPhase(String esaPhase) { this.esaPhase = esaPhase; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
}
