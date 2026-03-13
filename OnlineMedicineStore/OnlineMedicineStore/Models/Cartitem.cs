using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("cartitems")]
[Index("CartId", Name = "CartID")]
[Index("MedicineId", Name = "MedicineID")]
public partial class Cartitem
{
    [Key]
    [Column("CartItemID")]
    public int CartItemId { get; set; }

    [Column("CartID")]
    public int? CartId { get; set; }

    [Column("MedicineID")]
    public int? MedicineId { get; set; }

    public int? Quantity { get; set; }

    [ForeignKey("CartId")]
    [InverseProperty("Cartitems")]
    public virtual Cart? Cart { get; set; }

    [ForeignKey("MedicineId")]
    [InverseProperty("Cartitems")]
    public virtual Medicine? Medicine { get; set; }
}
