package com.infosys.realestate.dto;

public class ZoningRequest {

    private Long propertyId;

    private String zoningCategory;
    private String zoningClass;
    private String planningAuthority;
    private String masterPlan;
    private String parcelIdentifier;
    private String complianceStatus;

    private Double maxFar;
    private String maxHeight;
    private String groundCoverage;
    private String minPlotArea;

    private String frontSetback;
    private String rearSetback;
    private String leftSetback;
    private String rightSetback;

    private String permittedUsage;
    private String restrictedUsage;
    private String specialRegulations;

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getZoningCategory() {
        return zoningCategory;
    }

    public void setZoningCategory(String zoningCategory) {
        this.zoningCategory = zoningCategory;
    }

    public String getZoningClass() {
        return zoningClass;
    }

    public void setZoningClass(String zoningClass) {
        this.zoningClass = zoningClass;
    }

    public String getPlanningAuthority() {
        return planningAuthority;
    }

    public void setPlanningAuthority(String planningAuthority) {
        this.planningAuthority = planningAuthority;
    }

    public String getMasterPlan() {
        return masterPlan;
    }

    public void setMasterPlan(String masterPlan) {
        this.masterPlan = masterPlan;
    }

    public String getParcelIdentifier() {
        return parcelIdentifier;
    }

    public void setParcelIdentifier(String parcelIdentifier) {
        this.parcelIdentifier = parcelIdentifier;
    }

    public String getComplianceStatus() {
        return complianceStatus;
    }

    public void setComplianceStatus(String complianceStatus) {
        this.complianceStatus = complianceStatus;
    }

    public Double getMaxFar() {
        return maxFar;
    }

    public void setMaxFar(Double maxFar) {
        this.maxFar = maxFar;
    }

    public String getMaxHeight() {
        return maxHeight;
    }

    public void setMaxHeight(String maxHeight) {
        this.maxHeight = maxHeight;
    }

    public String getGroundCoverage() {
        return groundCoverage;
    }

    public void setGroundCoverage(String groundCoverage) {
        this.groundCoverage = groundCoverage;
    }

    public String getMinPlotArea() {
        return minPlotArea;
    }

    public void setMinPlotArea(String minPlotArea) {
        this.minPlotArea = minPlotArea;
    }

    public String getFrontSetback() {
        return frontSetback;
    }

    public void setFrontSetback(String frontSetback) {
        this.frontSetback = frontSetback;
    }

    public String getRearSetback() {
        return rearSetback;
    }

    public void setRearSetback(String rearSetback) {
        this.rearSetback = rearSetback;
    }

    public String getLeftSetback() {
        return leftSetback;
    }

    public void setLeftSetback(String leftSetback) {
        this.leftSetback = leftSetback;
    }

    public String getRightSetback() {
        return rightSetback;
    }

    public void setRightSetback(String rightSetback) {
        this.rightSetback = rightSetback;
    }

    public String getPermittedUsage() {
        return permittedUsage;
    }

    public void setPermittedUsage(String permittedUsage) {
        this.permittedUsage = permittedUsage;
    }

    public String getRestrictedUsage() {
        return restrictedUsage;
    }

    public void setRestrictedUsage(String restrictedUsage) {
        this.restrictedUsage = restrictedUsage;
    }

    public String getSpecialRegulations() {
        return specialRegulations;
    }

    public void setSpecialRegulations(String specialRegulations) {
        this.specialRegulations = specialRegulations;
    }
}