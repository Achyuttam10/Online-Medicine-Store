using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("categories")]
public partial class Category
{
    [Key]
    [Column("CategoryID")]
    public int CategoryId { get; set; }

    [StringLength(100)]
    public string CategoryName { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [InverseProperty("Category")]
    public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
}
