using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("cart")]
[Index("CustomerId", Name = "CustomerID", IsUnique = true)]
public partial class Cart
{
    [Key]
    [Column("CartID")]
    public int CartId { get; set; }

    [Column("CustomerID")]
    public int? CustomerId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [InverseProperty("Cart")]
    public virtual ICollection<Cartitem> Cartitems { get; set; } = new List<Cartitem>();

    [ForeignKey("CustomerId")]
    [InverseProperty("Cart")]
    public virtual Customer? Customer { get; set; }
}
