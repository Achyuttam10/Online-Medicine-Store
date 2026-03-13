using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("orders")]
[Index("CustomerId", Name = "idx_order_customer")]
public partial class Order
{
    [Key]
    [Column("OrderID")]
    public int OrderId { get; set; }

    [Column("CustomerID")]
    public int? CustomerId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? OrderDate { get; set; }

    [Precision(10, 2)]
    public decimal? TotalAmount { get; set; }

    [StringLength(50)]
    public string? OrderStatus { get; set; }

    [Column(TypeName = "text")]
    public string? ShippingAddress { get; set; }

    [ForeignKey("CustomerId")]
    [InverseProperty("Orders")]
    public virtual Customer? Customer { get; set; }

    [InverseProperty("Order")]
    public virtual ICollection<Orderitem> Orderitems { get; set; } = new List<Orderitem>();
}
