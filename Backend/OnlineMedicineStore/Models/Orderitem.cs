using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("orderitems")]
[Index("MedicineId", Name = "MedicineID")]
[Index("OrderId", Name = "idx_orderitems_order")]
public partial class Orderitem
{
    [Key]
    [Column("OrderItemID")]
    public int OrderItemId { get; set; }

    [Column("OrderID")]
    public int? OrderId { get; set; }

    [Column("MedicineID")]
    public int? MedicineId { get; set; }

    public int? Quantity { get; set; }

    [Precision(10, 2)]
    public decimal? Price { get; set; }

    [ForeignKey("MedicineId")]
    [InverseProperty("Orderitems")]
    public virtual Medicine? Medicine { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("Orderitems")]
    public virtual Order? Order { get; set; }
}
