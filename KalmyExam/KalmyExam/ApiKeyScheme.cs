﻿using Microsoft.OpenApi.Models;

namespace KalmyExam
{
    internal class ApiKeyScheme : OpenApiSecurityScheme
    {
        public string In { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}