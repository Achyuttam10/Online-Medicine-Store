using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedicineStore.Models;

[Table("admins")]
[Index("Email", Name = "Email", IsUnique = true)]
public partial class Admin
{
    [Key]
    [Column("AdminID")]
    public int AdminId { get; set; }

    [StringLength(100)]
    public string? Name { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Password { get; set; }

    [StringLength(50)]
    public string? Role { get; set; }
}
