{
                "protocol": "GlobalAllianceApi",
                "namespace": "org.ga4gh",
                "types": [{
                    "type": "error",
                    "name": "GAException",
                    "doc": "A general exception type.",
                    "fields": [{
                        "name": "message",
                        "type": "string",
                        "doc": "The error message"
                    }, {
                        "name": "errorCode",
                        "type": "int",
                        "doc": "The numerical error code",
                        "default": -1
                    }]
                }, {
                    "type": "record",
                    "name": "GAPosition",
                    "doc": "An abstraction for referring to a genomic position, in relation to some\nalready known reference. For now, represents a genomic position as a reference\nname, a base number on that reference (0-based), and a flag to say if it's the\nforward or reverse strand that we're talking about.",
                    "fields": [{
                        "name": "referenceName",
                        "type": "string",
                        "doc": "The name of the reference (or, more technically, the scaffold) in whatever\n  reference set is being used. Does not generally include a \"chr\" prefix, so for\n  example \"X\" would be used for the X chromosome."
                    }, {
                        "name": "position",
                        "type": "long",
                        "doc": "The 0-based offset from the start of the forward strand for that reference.\n  Genomic positions are non-negative integers less than reference length."
                    }, {
                        "name": "reverseStrand",
                        "type": "boolean",
                        "doc": "A flag to indicate if we are on the forward strand (`false`) or reverse\n  strand (`true`)."
                    }]
                }, {
                    "type": "enum",
                    "name": "GACigarOperation",
                    "doc": "An enum for the different types of CIGAR alignment operations that exist.\nUsed wherever CIGAR alignments are used. The different enumerated values\nhave the following usage:\n\n* `ALIGNMENT_MATCH`: An alignment match indicates that a sequence can be\n  aligned to the reference without evidence of an INDEL. Unlike the\n  `SEQUENCE_MATCH` and `SEQUENCE_MISMATCH` operators, the `ALIGNMENT_MATCH`\n  operator does not indicate whether the reference and read sequences are an\n  exact match. This operator is equivalent to SAM's `M`.\n* `INSERT`: The insert operator indicates that the read contains evidence of\n  bases being inserted into the reference. This operator is equivalent to\n  SAM's `I`.\n* `DELETE`: The delete operator indicates that the read contains evidence of\n  bases being deleted from the reference. This operator is equivalent to\n  SAM's `D`.\n* `SKIP`: The skip operator indicates that this read skips a long segment of\n  the reference, but the bases have not been deleted. This operator is\n  commonly used when working with RNA-seq data, where reads may skip long\n  segments of the reference between exons. This operator is equivalent to\n  SAM's 'N'.\n* `CLIP_SOFT`: The soft clip operator indicates that bases at the start/end\n  of a read have not been considered during alignment. This may occur if the\n  majority of a read maps, except for low quality bases at the start/end of\n  a read. This operator is equivalent to SAM's 'S'. Bases that are soft clipped\n  will still be stored in the read.\n* `CLIP_HARD`: The hard clip operator indicates that bases at the start/end of\n  a read have been omitted from this alignment. This may occur if this linear\n  alignment is part of a chimeric alignment, or if the read has been trimmed\n  (e.g., during error correction, or to trim poly-A tails for RNA-seq). This\n  operator is equivalent to SAM's 'H'.\n* `PAD`: The pad operator indicates that there is padding in an alignment.\n  This operator is equivalent to SAM's 'P'.\n* `SEQUENCE_MATCH`: This operator indicates that this portion of the aligned\n  sequence exactly matches the reference (e.g., all bases are equal to the\n  reference bases). This operator is equivalent to SAM's '='.\n* `SEQUENCE_MISMATCH`: This operator indicates that this portion of the\n  aligned sequence is an alignment match to the reference, but a sequence\n  mismatch (e.g., the bases are not equal to the reference). This can\n  indicate a SNP or a read error. This operator is equivalent to SAM's 'X'.",
                    "symbols": ["ALIGNMENT_MATCH", "INSERT", "DELETE", "SKIP", "CLIP_SOFT", "CLIP_HARD", "PAD", "SEQUENCE_MATCH", "SEQUENCE_MISMATCH"]
                }, {
                    "type": "record",
                    "name": "GACigarUnit",
                    "doc": "A structure for an instance of a CIGAR operation.",
                    "fields": [{
                        "name": "operation",
                        "type": "GACigarOperation",
                        "doc": "The operation type."
                    }, {
                        "name": "operationLength",
                        "type": "long",
                        "doc": "The number of bases that the operation runs for."
                    }, {
                        "name": "referenceSequence",
                        "type": ["null", "string"],
                        "doc": "`referenceSequence` is only used at mismatches (`SEQUENCE_MISMATCH`)\n  and deletions (`DELETE`). Filling this field replaces the MD tag.\n  If the relevant information is not available, leave this field as `null`.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAProgram",
                    "fields": [{
                        "name": "commandLine",
                        "type": ["null", "string"],
                        "doc": "The command line used to run this program.",
                        "default": null
                    }, {
                        "name": "id",
                        "type": ["null", "string"],
                        "doc": "The user specified ID of the program.",
                        "default": null
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "The name of the program.",
                        "default": null
                    }, {
                        "name": "prevProgramId",
                        "type": ["null", "string"],
                        "doc": "The ID of the program run before this one.",
                        "default": null
                    }, {
                        "name": "version",
                        "type": ["null", "string"],
                        "doc": "The version of the program run.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GADataset",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The dataset ID."
                    }, {
                        "name": "description",
                        "type": ["null", "string"],
                        "doc": "The dataset description.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAExperiment",
                    "fields": [{
                        "name": "libraryId",
                        "type": ["null", "string"],
                        "doc": "The library used as part of this experiment.",
                        "default": null
                    }, {
                        "name": "platformUnit",
                        "type": ["null", "string"],
                        "doc": "The platform unit used as part of this experiment.",
                        "default": null
                    }, {
                        "name": "sequencingCenter",
                        "type": ["null", "string"],
                        "doc": "The sequencing center used as part of this experiment."
                    }, {
                        "name": "instrumentModel",
                        "type": ["null", "string"],
                        "doc": "The instrument model used as part of this experiment.\n  This maps to sequencing technology in BAM."
                    }]
                }, {
                    "type": "record",
                    "name": "GAReadGroup",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The read group ID."
                    }, {
                        "name": "datasetId",
                        "type": ["null", "string"],
                        "doc": "The ID of the dataset this read group belongs to.",
                        "default": null
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "The read group name.",
                        "default": null
                    }, {
                        "name": "description",
                        "type": ["null", "string"],
                        "doc": "The read group description.",
                        "default": null
                    }, {
                        "name": "sampleId",
                        "type": ["null", "string"],
                        "doc": "The sample this read group's data was generated from."
                    }, {
                        "name": "experiment",
                        "type": ["null", "GAExperiment"],
                        "doc": "The experiment used to generate this read group."
                    }, {
                        "name": "predictedInsertSize",
                        "type": ["null", "int"],
                        "doc": "The predicted insert size of this read group.",
                        "default": null
                    }, {
                        "name": "created",
                        "type": ["null", "long"],
                        "doc": "The time at which this read group was created in milliseconds from the epoch.",
                        "default": null
                    }, {
                        "name": "updated",
                        "type": ["null", "long"],
                        "doc": "The time at which this read group was last updated in milliseconds\n  from the epoch.",
                        "default": null
                    }, {
                        "name": "programs",
                        "type": {
                            "type": "array",
                            "items": "GAProgram"
                        },
                        "doc": "The programs used to generate this read group.",
                        "default": []
                    }, {
                        "name": "referenceSetId",
                        "type": ["null", "string"],
                        "doc": "The reference set the reads in this read group are aligned to.\n  Required if there are any read alignments.",
                        "default": null
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "A map of additional read group information.",
                        "default": {}
                    }]
                }, {
                    "type": "record",
                    "name": "GAReadGroupSet",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The read group set ID."
                    }, {
                        "name": "datasetId",
                        "type": ["null", "string"],
                        "doc": "The ID of the dataset this read group set belongs to.",
                        "default": null
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "The read group set name.",
                        "default": null
                    }, {
                        "name": "readGroups",
                        "type": {
                            "type": "array",
                            "items": "GAReadGroup"
                        },
                        "doc": "The read groups in this set.",
                        "default": []
                    }]
                }, {
                    "type": "record",
                    "name": "GALinearAlignment",
                    "doc": "A linear alignment can be represented by one CIGAR string.",
                    "fields": [{
                        "name": "position",
                        "type": "GAPosition",
                        "doc": "The position of this alignment."
                    }, {
                        "name": "mappingQuality",
                        "type": ["null", "int"],
                        "doc": "The mapping quality of this alignment. Represents how likely\n  the read maps to this position as opposed to other locations.",
                        "default": null
                    }, {
                        "name": "cigar",
                        "type": {
                            "type": "array",
                            "items": "GACigarUnit"
                        },
                        "doc": "Represents the local alignment of this sequence (alignment matches, indels, etc)\n  versus the reference.",
                        "default": []
                    }]
                }, {
                    "type": "record",
                    "name": "GAReadAlignment",
                    "doc": "Each read alignment describes a linear alignment with additional information\nabout the fragment and the read. A read alignment object is equivalent to a\nline in a SAM file.",
                    "fields": [{
                        "name": "id",
                        "type": ["null", "string"],
                        "doc": "The read alignment ID. This ID is unique within the read group this\n  alignment belongs to. This field may not be provided by all backends.\n  Its intended use is to make caching and UI display easier for\n  genome browsers and other light weight clients."
                    }, {
                        "name": "readGroupId",
                        "type": "string",
                        "doc": "The ID of the read group this read belongs to.\n  (Every read must belong to exactly one read group.)"
                    }, {
                        "name": "fragmentName",
                        "type": "string",
                        "doc": "The fragment name. Equivalent to QNAME (query template name) in SAM."
                    }, {
                        "name": "properPlacement",
                        "type": ["null", "boolean"],
                        "doc": "The orientation and the distance between reads from the fragment are\n  consistent with the sequencing protocol (extension to SAM flag 0x2)",
                        "default": false
                    }, {
                        "name": "duplicateFragment",
                        "type": ["null", "boolean"],
                        "doc": "The fragment is a PCR or optical duplicate (SAM flag 0x400)",
                        "default": false
                    }, {
                        "name": "numberReads",
                        "type": ["null", "int"],
                        "doc": "The number of reads in the fragment (extension to SAM flag 0x1)",
                        "default": null
                    }, {
                        "name": "fragmentLength",
                        "type": ["null", "int"],
                        "doc": "The observed length of the fragment, equivalent to TLEN in SAM.",
                        "default": null
                    }, {
                        "name": "readNumber",
                        "type": ["null", "int"],
                        "doc": "The read number in sequencing. 0-based and less than numberReads. This field\n  replaces SAM flag 0x40 and 0x80.",
                        "default": null
                    }, {
                        "name": "failedVendorQualityChecks",
                        "type": ["null", "boolean"],
                        "doc": "SAM flag 0x200",
                        "default": false
                    }, {
                        "name": "alignment",
                        "type": ["null", "GALinearAlignment"],
                        "doc": "The linear alignment for this alignment record. This field will be\n  null if the read is unmapped.",
                        "default": null
                    }, {
                        "name": "secondaryAlignment",
                        "type": ["null", "boolean"],
                        "doc": "Whether this alignment is secondary. Equivalent to SAM flag 0x100.\n  A secondary alignment represents an alternative to the primary alignment\n  for this read. Aligners may return secondary alignments if a read can map\n  ambiguously to multiple coordinates in the genome.\n\n  By convention, each read has one and only one alignment where both\n  secondaryAlignment and supplementaryAlignment are false.",
                        "default": false
                    }, {
                        "name": "supplementaryAlignment",
                        "type": ["null", "boolean"],
                        "doc": "Whether this alignment is supplementary. Equivalent to SAM flag 0x800.\n  Supplementary alignments are used in the representation of a chimeric\n  alignment. In a chimeric alignment, a read is split into multiple\n  linear alignments that map to different reference contigs. The first\n  linear alignment in the read will be designated as the representative alignment;\n  the remaining linear alignments will be designated as supplementary alignments.\n  These alignments may have different mapping quality scores.\n\n  In each linear alignment in a chimeric alignment, the read will be hard clipped.\n  The `alignedSequence` and `alignedQuality` fields in the alignment record will\n  only represent the bases for its respective linear alignment.",
                        "default": false
                    }, {
                        "name": "alignedSequence",
                        "type": ["null", "string"],
                        "doc": "The bases of the read sequence contained in this alignment record.\n  `alignedSequence` and `alignedQuality` may be shorter than the full read sequence\n  and quality. This will occur if the alignment is part of a chimeric alignment,\n  or if the read was trimmed. When this occurs, the CIGAR for this read will\n  begin/end with a hard clip operator that will indicate the length of the excised sequence.",
                        "default": null
                    }, {
                        "name": "alignedQuality",
                        "type": {
                            "type": "array",
                            "items": "int"
                        },
                        "doc": "The quality of the read sequence contained in this alignment record.\n  `alignedSequence` and `alignedQuality` may be shorter than the full read sequence\n  and quality. This will occur if the alignment is part of a chimeric alignment,\n  or if the read was trimmed. When this occurs, the CIGAR for this read will\n  begin/end with a hard clip operator that will indicate the length of the excised sequence.",
                        "default": []
                    }, {
                        "name": "nextMatePosition",
                        "type": ["null", "GAPosition"],
                        "doc": "The mapping of the primary alignment of the `(readNumber+1)%numberReads`\n  read in the fragment. It replaces mate position and mate strand in SAM.",
                        "default": null
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "A map of additional read alignment information.",
                        "default": {}
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReadsRequest",
                    "doc": "This request maps to the body of `POST /reads/search` as JSON.\n\nIf a reference is specified, all queried `GAReadGroup`s must be aligned\nto `GAReferenceSet`s containing that same `GAReference`. If no reference is\nspecified, all `GAReadGroup`s must be aligned to the same `GAReferenceSet`.",
                    "fields": [{
                        "name": "readGroupIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If specified, restrict this query to reads within the given readgroups.",
                        "default": []
                    }, {
                        "name": "referenceName",
                        "type": ["null", "string"],
                        "doc": "The reference to query. Provide at most one of `referenceId` and\n  `referenceName`. Leaving both blank returns results from all references,\n  including unmapped reads - this could be very large.",
                        "default": null
                    }, {
                        "name": "referenceId",
                        "type": ["null", "string"],
                        "doc": "The reference to query. Provide at most one of `referenceId` and\n  `referenceName`. Leaving both blank returns results from all\n  references, including unmapped reads - this could be very large.",
                        "default": null
                    }, {
                        "name": "start",
                        "type": ["null", "long"],
                        "doc": "The start position (0-based) of this query.\n  If a reference is specified, this defaults to 0.\n  Genomic positions are non-negative integers less than reference length.\n  Requests spanning the join of circular genomes are represented as \n  two requests one on each side of the join (position 0).",
                        "default": 0
                    }, {
                        "name": "end",
                        "type": ["null", "long"],
                        "doc": "The end position (0-based, exclusive) of this query.\n  If a reference is specified, this defaults to the\n  reference's length.",
                        "default": null
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReadsResponse",
                    "doc": "This is the response from `POST /reads/search` expressed as JSON.",
                    "fields": [{
                        "name": "alignments",
                        "type": {
                            "type": "array",
                            "items": "GAReadAlignment"
                        },
                        "doc": "The list of matching alignment records, sorted by position.\n  Unmapped reads, which have no position, are returned last.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReadGroupSetsRequest",
                    "doc": "This request maps to the body of `POST /readgroupsets/search` as JSON.",
                    "fields": [{
                        "name": "datasetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "The list of datasets to search.",
                        "default": []
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "Only return read group sets for which a substring of the name matches\n  this string.",
                        "default": null
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReadGroupSetsResponse",
                    "doc": "This is the response from `POST /readgroupsets/search` expressed as JSON.",
                    "fields": [{
                        "name": "readGroupSets",
                        "type": {
                            "type": "array",
                            "items": "GAReadGroupSet"
                        },
                        "doc": "The list of matching read group sets.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAVariantSetMetadata",
                    "doc": "This metadata represents VCF header information.",
                    "fields": [{
                        "name": "key",
                        "type": "string",
                        "doc": "The top-level key."
                    }, {
                        "name": "value",
                        "type": "string",
                        "doc": "The value field for simple metadata."
                    }, {
                        "name": "id",
                        "type": "string",
                        "doc": "User-provided ID field, not enforced by this API.\n  Two or more pieces of structured metadata with identical\n  id and key fields are considered equivalent."
                    }, {
                        "name": "type",
                        "type": "string",
                        "doc": "The type of data."
                    }, {
                        "name": "number",
                        "type": "string",
                        "doc": "The number of values that can be included in a field described by this\n  metadata."
                    }, {
                        "name": "description",
                        "type": "string",
                        "doc": "A textual description of this metadata."
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "Remaining structured metadata key-value pairs.",
                        "default": {}
                    }]
                }, {
                    "type": "record",
                    "name": "GAVariantSet",
                    "doc": "`GAVariant` and `GACallSet` both belong to a `GAVariantSet`.\n`GAVariantSet` belongs to a `GADataset`.\nThe variant set is equivalent to a VCF file.",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The variant set ID."
                    }, {
                        "name": "datasetId",
                        "type": "string",
                        "doc": "The ID of the dataset this variant set belongs to."
                    }, {
                        "name": "metadata",
                        "type": {
                            "type": "array",
                            "items": "GAVariantSetMetadata"
                        },
                        "doc": "The metadata associated with this variant set. This is equivalent to\n  the VCF header information not already presented in first class fields.",
                        "default": []
                    }]
                }, {
                    "type": "record",
                    "name": "GACallSet",
                    "doc": "A `GACallSet` is a collection of variant calls for a particular sample.\nIt belongs to a `GAVariantSet`. This is equivalent to one column in VCF.",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The call set ID."
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "The call set name.",
                        "default": null
                    }, {
                        "name": "sampleId",
                        "type": ["null", "string"],
                        "doc": "The sample this call set's data was generated from."
                    }, {
                        "name": "variantSetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "The IDs of the variant sets this call set has calls in.",
                        "default": []
                    }, {
                        "name": "created",
                        "type": ["null", "long"],
                        "doc": "The date this call set was created in milliseconds from the epoch.",
                        "default": null
                    }, {
                        "name": "updated",
                        "type": ["null", "long"],
                        "doc": "The time at which this call set was last updated in\n  milliseconds from the epoch.",
                        "default": null
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "A map of additional call set information.",
                        "default": {}
                    }]
                }, {
                    "type": "record",
                    "name": "GACall",
                    "doc": "A `GACall` represents the determination of genotype with respect to a\nparticular variant. It may include associated information such as quality\nand phasing. For example, a call might assign a probability of 0.32 to\nthe occurrence of a SNP named rs1234 in a call set with the name NA12345.",
                    "fields": [{
                        "name": "callSetId",
                        "type": ["null", "string"],
                        "doc": "The ID of the call set this variant call belongs to.\n  If this field is not present, the ordering of the call sets from a\n  `SearchCallSetsRequest` over this `GAVariantSet` is guaranteed to match\n  the ordering of the calls on this `GAVariant`.\n  The number of results will also be the same."
                    }, {
                        "name": "callSetName",
                        "type": ["null", "string"],
                        "doc": "The name of the call set this variant call belongs to.\n  If this field is not present, the ordering of the call sets from a\n  `SearchCallSetsRequest` over this `GAVariantSet` is guaranteed to match\n  the ordering of the calls on this `GAVariant`.\n  The number of results will also be the same.",
                        "default": null
                    }, {
                        "name": "genotype",
                        "type": {
                            "type": "array",
                            "items": "int"
                        },
                        "doc": "The genotype of this variant call. Each value represents either the value\n  of the referenceBases field or is a 1-based index into alternateBases.\n  If a variant had a referenceBases field of \"T\", an alternateBases\n  value of [\"A\", \"C\"], and the genotype was [2, 1], that would mean the call\n  represented the heterozygous value \"CA\" for this variant. If the genotype\n  was instead [0, 1] the represented value would be \"TA\". Ordering of the\n  genotype values is important if the phaseset field is present.",
                        "default": []
                    }, {
                        "name": "phaseset",
                        "type": ["null", "string"],
                        "doc": "If this field is present, this variant call's genotype ordering implies\n  the phase of the bases and is consistent with any other variant calls on\n  the same contig which have the same phaseset value.",
                        "default": null
                    }, {
                        "name": "genotypeLikelihood",
                        "type": {
                            "type": "array",
                            "items": "double"
                        },
                        "doc": "The genotype likelihoods for this variant call. Each array entry\n  represents how likely a specific genotype is for this call. The value\n  ordering is defined by the GL tag in the VCF spec.",
                        "default": []
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "A map of additional variant call information.",
                        "default": {}
                    }]
                }, {
                    "type": "record",
                    "name": "GAVariant",
                    "doc": "A `GAVariant` represents a change in DNA sequence relative to some reference.\nFor example, a variant could represent a SNP or an insertion.\nVariants belong to a `GAVariantSet`.\nThis is equivalent to a row in VCF.",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The variant ID."
                    }, {
                        "name": "variantSetId",
                        "type": "string",
                        "doc": "The ID of the variant set this variant belongs to."
                    }, {
                        "name": "names",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "Names for the variant, for example a RefSNP ID.",
                        "default": []
                    }, {
                        "name": "created",
                        "type": ["null", "long"],
                        "doc": "The date this variant was created in milliseconds from the epoch.",
                        "default": null
                    }, {
                        "name": "updated",
                        "type": ["null", "long"],
                        "doc": "The time at which this variant was last updated in\n  milliseconds from the epoch.",
                        "default": null
                    }, {
                        "name": "referenceName",
                        "type": "string",
                        "doc": "The reference on which this variant occurs.\n  (e.g. `chr20` or `X`)"
                    }, {
                        "name": "start",
                        "type": "long",
                        "doc": "The start position at which this variant occurs (0-based).\n  This corresponds to the first base of the string of reference bases.\n  Genomic positions are non-negative integers less than reference length.\n  Variants spanning the join of circular genomes are represented as\n  two variants one on each side of the join (position 0)."
                    }, {
                        "name": "end",
                        "type": "long",
                        "doc": "The end position (exclusive), resulting in [start, end) closed-open interval.\n  This is typically calculated by `start + referenceBases.length`."
                    }, {
                        "name": "referenceBases",
                        "type": "string",
                        "doc": "The reference bases for this variant. They start at the given position."
                    }, {
                        "name": "alternateBases",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "The bases that appear instead of the reference bases.",
                        "default": []
                    }, {
                        "name": "info",
                        "type": {
                            "type": "map",
                            "values": {
                                "type": "array",
                                "items": "string"
                            }
                        },
                        "doc": "A map of additional variant information.",
                        "default": {}
                    }, {
                        "name": "calls",
                        "type": {
                            "type": "array",
                            "items": "GACall"
                        },
                        "doc": "The variant calls for this particular variant. Each one represents the\n  determination of genotype with respect to this variant.",
                        "default": []
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchVariantSetsRequest",
                    "doc": "This request maps to the body of `POST /variantsets/search` as JSON.",
                    "fields": [{
                        "name": "datasetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If specified, will restrict the query to variant sets within the\n    given datasets.",
                        "default": []
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page. \n    If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n    To get the next page of results, set this parameter to the value of\n    `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchVariantSetsResponse",
                    "doc": "This is the response from `POST /variantsets/search` expressed as JSON.",
                    "fields": [{
                        "name": "variantSets",
                        "type": {
                            "type": "array",
                            "items": "GAVariantSet"
                        },
                        "doc": "The list of matching variant sets.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n    Provide this value in a subsequent request to return the next page of\n    results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchVariantsRequest",
                    "doc": "This request maps to the body of `POST /variants/search` as JSON.",
                    "fields": [{
                        "name": "variantSetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "Required. The IDs of the variant sets to search over.",
                        "default": []
                    }, {
                        "name": "variantName",
                        "type": ["null", "string"],
                        "doc": "Only return variants which have exactly this name.",
                        "default": null
                    }, {
                        "name": "callSetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "Only return variant calls which belong to call sets with these IDs.\n  Leaving this blank returns all variant calls.",
                        "default": []
                    }, {
                        "name": "referenceName",
                        "type": "string",
                        "doc": "Required. Only return variants on this reference."
                    }, {
                        "name": "start",
                        "type": "long",
                        "doc": "Required. The beginning of the window (0-based, inclusive) for\n  which overlapping variants should be returned.\n  Genomic positions are non-negative integers less than reference length.\n  Requests spanning the join of circular genomes are represented as\n  two requests one on each side of the join (position 0)."
                    }, {
                        "name": "end",
                        "type": "long",
                        "doc": "Required. The end of the window (0-based, exclusive) for which overlapping\n  variants should be returned."
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchVariantsResponse",
                    "doc": "This is the response from `POST /variants/search` expressed as JSON.",
                    "fields": [{
                        "name": "variants",
                        "type": {
                            "type": "array",
                            "items": "GAVariant"
                        },
                        "doc": "The list of matching variants.\n  If the `callSetId` field on the returned calls is not present,\n  the ordering of the call sets from a `SearchCallSetsRequest`\n  over the parent `GAVariantSet` is guaranteed to match the ordering\n  of the calls on each `GAVariant`. The number of results will also be\n  the same.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchCallSetsRequest",
                    "doc": "This request maps to the body of `POST /callsets/search` as JSON.",
                    "fields": [{
                        "name": "variantSetIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If specified, will restrict the query to call sets within the\n  given variant sets.",
                        "default": []
                    }, {
                        "name": "name",
                        "type": ["null", "string"],
                        "doc": "Only return call sets for which a substring of the name matches this\n  string.",
                        "default": null
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchCallSetsResponse",
                    "doc": "This is the response from `POST /callsets/search` expressed as JSON.",
                    "fields": [{
                        "name": "callSets",
                        "type": {
                            "type": "array",
                            "items": "GACallSet"
                        },
                        "doc": "The list of matching call sets.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAReference",
                    "doc": "A `GAReference` is a canonical assembled contig, intended to act as a\nreference coordinate space for other genomic annotations. A single\n`GAReference` might represent the human chromosome 1, for instance.",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The reference ID. Unique within the repository."
                    }, {
                        "name": "length",
                        "type": "long",
                        "doc": "The length of this reference's sequence."
                    }, {
                        "name": "md5checksum",
                        "type": "string",
                        "doc": "MD5 of the upper-case sequence excluding all whitespace characters\n  (this is equivalent to SQ:M5 in SAM)."
                    }, {
                        "name": "name",
                        "type": "string",
                        "doc": "The name of this reference. (e.g. '22') Also see the\n  `names` field on the parent `GAReferenceSet`."
                    }, {
                        "name": "sourceURI",
                        "type": ["null", "string"],
                        "doc": "The URI from which the sequence was obtained.\n  Specifies a FASTA format file/string with one name, sequence pair.",
                        "default": null
                    }, {
                        "name": "sourceAccessions",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "All known corresponding accession IDs in INSDC (GenBank/ENA/DDBJ) ideally\n  with a version number, e.g. `GCF_000001405.26`."
                    }, {
                        "name": "isDerived",
                        "type": "boolean",
                        "doc": "A sequence X is said to be derived from source sequence Y, if X and Y\n  are of the same length and the per-base sequence divergence at A/C/G/T bases\n  is sufficiently small. Two sequences derived from the same official\n  sequence share the same coordinates and annotations, and\n  can be replaced with the official sequence for certain use cases.",
                        "default": false
                    }, {
                        "name": "sourceDivergence",
                        "type": ["null", "float"],
                        "doc": "The `sourceDivergence` is the fraction of non-indel bases that do not match the\n  reference this record was derived from.",
                        "default": null
                    }, {
                        "name": "ncbiTaxonId",
                        "type": ["null", "int"],
                        "doc": "ID from http://www.ncbi.nlm.nih.gov/taxonomy (e.g. 9606->human).",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAReferenceSet",
                    "doc": "A `GAReferenceSet` is a set of `GAReference`s which typically comprise a\nreference assembly, such as `GRCh38`. A `GAReferenceSet` defines a common\ncoordinate space for comparing reference-aligned experimental data.",
                    "fields": [{
                        "name": "id",
                        "type": "string",
                        "doc": "The reference set ID. Unique in the repository."
                    }, {
                        "name": "referenceIds",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "The IDs of the `GAReference` objects that are part of this set.",
                        "default": []
                    }, {
                        "name": "md5checksum",
                        "type": "string",
                        "doc": "Order-independent MD5 checksum which identifies this `GAReferenceSet`. The\n  checksum is computed by sorting all `reference.md5checksum` (for all\n  `reference` in this set) in ascending lexicographic order, concatenating,\n  and taking the MD5 of that value."
                    }, {
                        "name": "ncbiTaxonId",
                        "type": ["null", "int"],
                        "doc": "ID from http://www.ncbi.nlm.nih.gov/taxonomy (e.g. 9606->human) indicating\n  the species which this assembly is intended to model. Note that contained\n  `GAReference`s may specify a different `ncbiTaxonId`, as assemblies may\n  contain reference sequences which do not belong to the modeled species, e.g.\n  EBV in a human reference genome.",
                        "default": null
                    }, {
                        "name": "description",
                        "type": ["null", "string"],
                        "doc": "Optional free text description of this reference set.",
                        "default": null
                    }, {
                        "name": "assemblyId",
                        "type": ["null", "string"],
                        "doc": "Public id of this reference set, such as `GRCh37`.",
                        "default": null
                    }, {
                        "name": "sourceURI",
                        "type": ["null", "string"],
                        "doc": "Specifies a FASTA format file/string.",
                        "default": null
                    }, {
                        "name": "sourceAccessions",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "All known corresponding accession IDs in INSDC (GenBank/ENA/DDBJ) ideally\n  with a version number, e.g. `NC_000001.11`."
                    }, {
                        "name": "isDerived",
                        "type": "boolean",
                        "doc": "A reference set may be derived from a source if it contains\n  additional sequences, or some of the sequences within it are derived\n  (see the definition of `isDerived` in `GAReference`).",
                        "default": false
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReferenceSetsRequest",
                    "doc": "This request maps to the body of `POST /referencesets/search`\nas JSON.",
                    "fields": [{
                        "name": "md5checksums",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If present, return the reference sets which match any of the given\n  `md5checksum`s. See `GAReferenceSet::md5checksum` for details.",
                        "default": []
                    }, {
                        "name": "accessions",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If present, return reference sets for which the accession\n  matches this string. Best to give a version number (e.g. `GCF_000001405.26`).\n  If only the main accession number is given then all records with\n  that main accession will be returned, whichever version.\n  Note that different versions will have different sequences.",
                        "default": []
                    }, {
                        "name": "assemblyId",
                        "type": ["null", "string"],
                        "doc": "If present, return reference sets for which the `assemblyId`\n  contains this string.",
                        "default": null
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReferenceSetsResponse",
                    "doc": "This is the response from `POST /referencesets/search`\nexpressed as JSON.",
                    "fields": [{
                        "name": "referenceSets",
                        "type": {
                            "type": "array",
                            "items": "GAReferenceSet"
                        },
                        "doc": "The list of matching reference sets.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReferencesRequest",
                    "doc": "This request maps to the body of `POST /references/search`\nas JSON.",
                    "fields": [{
                        "name": "md5checksums",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If present, return references which match any of the given `md5checksums`.\n  See `GAReference::md5checksum` for details.",
                        "default": []
                    }, {
                        "name": "accessions",
                        "type": {
                            "type": "array",
                            "items": "string"
                        },
                        "doc": "If present, return references for which the accession\n  matches this string. Best to give a version number e.g. `GCF_000001405.26`.\n  If only the main accession number is given then all records with\n  that main accession will be returned, whichever version.\n  Note that different versions will have different sequences.",
                        "default": []
                    }, {
                        "name": "pageSize",
                        "type": ["null", "int"],
                        "doc": "Specifies the maximum number of results to return in a single page.\n  If unspecified, a system default will be used.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GASearchReferencesResponse",
                    "doc": "This is the response from `POST /references/search` expressed as JSON.",
                    "fields": [{
                        "name": "references",
                        "type": {
                            "type": "array",
                            "items": "GAReference"
                        },
                        "doc": "The list of matching references.",
                        "default": []
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAListReferenceBasesRequest",
                    "doc": "The query parameters for a request to `GET /references/{id}/bases`, for\nexample:\n\n`GET /references/{id}/bases?start=100&end=200`",
                    "fields": [{
                        "name": "start",
                        "type": "long",
                        "doc": "The start position (0-based) of this query. Defaults to 0.\n  Genomic positions are non-negative integers less than reference length.\n  Requests spanning the join of circular genomes are represented as\n  two requests one on each side of the join (position 0).",
                        "default": 0
                    }, {
                        "name": "end",
                        "type": ["null", "long"],
                        "doc": "The end position (0-based, exclusive) of this query. Defaults\n  to the length of this `GAReference`.",
                        "default": null
                    }, {
                        "name": "pageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  To get the next page of results, set this parameter to the value of\n  `nextPageToken` from the previous response.",
                        "default": null
                    }]
                }, {
                    "type": "record",
                    "name": "GAListReferenceBasesResponse",
                    "doc": "The response from `GET /references/{id}/bases` expressed as JSON.",
                    "fields": [{
                        "name": "offset",
                        "type": "long",
                        "doc": "The offset position (0-based) of the given `sequence` from the start of this\n  `GAReference`. This value will differ for each page in a paginated request.",
                        "default": 0
                    }, {
                        "name": "sequence",
                        "type": "string",
                        "doc": "A substring of the bases that make up this reference. Bases are represented\n  as IUPAC-IUB codes; this string matches the regexp `[ACGTMRWSYKVHDBN]*`."
                    }, {
                        "name": "nextPageToken",
                        "type": ["null", "string"],
                        "doc": "The continuation token, which is used to page through large result sets.\n  Provide this value in a subsequent request to return the next page of\n  results. This field will be empty if there aren't any additional results.",
                        "default": null
                    }]
                }],
                "messages": {
                    "searchReads": {
                        "doc": "Gets a list of `GAReadAlignment` matching the search criteria.\n\n`POST /reads/search` must accept a JSON version of `GASearchReadsRequest` as\nthe post body and will return a JSON version of `GASearchReadsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchReadsRequest",
                            "doc": "This request maps to the body of `POST /reads/search` as JSON."
                        }],
                        "response": "org.ga4gh.GASearchReadsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchReadGroupSets": {
                        "doc": "Gets a list of `GAReadGroupSet` matching the search criteria.\n\n`POST /readgroupsets/search` must accept a JSON version of\n`GASearchReadGroupSetsRequest` as the post body and will return a JSON\nversion of `GASearchReadGroupSetsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchReadGroupSetsRequest",
                            "doc": "This request maps to the body of `POST /readgroupsets/search` as JSON."
                        }],
                        "response": "org.ga4gh.GASearchReadGroupSetsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchVariantSets": {
                        "doc": "Gets a list of `GAVariantSet` matching the search criteria.\n\n  `POST /variantsets/search` must accept a JSON version of\n  `GASearchVariantSetsRequest` as the post body and will return a JSON version\n  of `GASearchVariantSetsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchVariantSetsRequest",
                            "doc": "This request maps to the body of `POST /variantsets/search` as JSON."
                        }],
                        "response": "org.ga4gh.GASearchVariantSetsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchVariants": {
                        "doc": "Gets a list of `GAVariant` matching the search criteria.\n\n`POST /variants/search` must accept a JSON version of `GASearchVariantsRequest`\nas the post body and will return a JSON version of `GASearchVariantsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchVariantsRequest",
                            "doc": "This request maps to the body of `POST /variants/search` as JSON."
                        }],
                        "response": "org.ga4gh.GASearchVariantsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchCallSets": {
                        "doc": "Gets a list of `GACallSet` matching the search criteria.\n\n`POST /callsets/search` must accept a JSON version of `GASearchCallSetsRequest`\nas the post body and will return a JSON version of `GASearchCallSetsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchCallSetsRequest",
                            "doc": "This request maps to the body of `POST /callsets/search` as JSON."
                        }],
                        "response": "org.ga4gh.GASearchCallSetsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchReferenceSets": {
                        "doc": "Gets a list of `GAReferenceSet` matching the search criteria.\n\n`POST /referencesets/search` must accept a JSON version of\n`GASearchReferenceSetsRequest` as the post body and will return a JSON\nversion of `GASearchReferenceSetsResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchReferenceSetsRequest",
                            "doc": "This request maps to the body of `POST /referencesets/search`\n    as JSON."
                        }],
                        "response": "org.ga4gh.GASearchReferenceSetsResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "getReferenceSet": {
                        "doc": "Gets a `GAReferenceSet` by ID.\n`GET /referencesets/{id}` will return a JSON version of `GAReferenceSet`.",
                        "request": [{
                            "name": "id",
                            "type": "string",
                            "doc": "The ID of the `GAReferenceSet`."
                        }],
                        "response": "org.ga4gh.GAReferenceSet",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "searchReferences": {
                        "doc": "Gets a list of `GAReference` matching the search criteria.\n\n`POST /references/search` must accept a JSON version of\n`GASearchReferencesRequest` as the post body and will return a JSON\nversion of `GASearchReferencesResponse`.",
                        "request": [{
                            "name": "request",
                            "type": "org.ga4gh.GASearchReferencesRequest",
                            "doc": "This request maps to the body of `POST /references/search`\n    as JSON."
                        }],
                        "response": "org.ga4gh.GASearchReferencesResponse",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "getReference": {
                        "doc": "Gets a `GAReference` by ID.\n`GET /references/{id}` will return a JSON version of `GAReference`.",
                        "request": [{
                            "name": "id",
                            "type": "string",
                            "doc": "The ID of the `GAReference`."
                        }],
                        "response": "org.ga4gh.GAReference",
                        "errors": ["org.ga4gh.GAException"]
                    },
                    "getReferenceBases": {
                        "doc": "Lists `GAReference` bases by ID and optional range.\n`GET /references/{id}/bases` will return a JSON version of\n`GAListReferenceBasesResponse`.",
                        "request": [{
                            "name": "id",
                            "type": "string",
                            "doc": "The ID of the `GAReference`."
                        }, {
                            "name": "request",
                            "type": "org.ga4gh.GAListReferenceBasesRequest",
                            "doc": "Additional request parameters to restrict the query."
                        }],
                        "response": "org.ga4gh.GAListReferenceBasesResponse",
                        "errors": ["org.ga4gh.GAException"]
                    }
                }
            }

