
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Addresses;

public class AddressRequest
{
    [Required]
    [StringLength(50)]
    public string Label { get; set; } = "Home";

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string AddressLine1 { get; set; } = string.Empty;

    [StringLength(150)]
    public string AddressLine2 { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string State { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Country { get; set; } = string.Empty;

    public bool IsDefault { get; set; }
}
