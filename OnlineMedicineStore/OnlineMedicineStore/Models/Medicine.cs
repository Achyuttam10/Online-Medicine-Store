using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("medicines")]
[Index("CategoryId", Name = "idx_medicine_category")]
public partial class Medicine
{
    [Key]
    [Column("MedicineID")]
    public int MedicineId { get; set; }

    [StringLength(150)]
    public string Name { get; set; } = null!;

    [Column("CategoryID")]
    public int? CategoryId { get; set; }

    [Precision(10, 2)]
    public decimal Price { get; set; }

    public int? StockQuantity { get; set; }

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? Manufacturer { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [InverseProperty("Medicine")]
    public virtual ICollection<Cartitem> Cartitems { get; set; } = new List<Cartitem>();

    [ForeignKey("CategoryId")]
    [InverseProperty("Medicines")]
    public virtual Category? Category { get; set; }

    [InverseProperty("Medicine")]
    public virtual ICollection<Orderitem> Orderitems { get; set; } = new List<Orderitem>();
}
